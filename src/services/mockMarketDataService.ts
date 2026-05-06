import type { Candle, CandleRange, MarketDataService, Quote, StockSearchOptions, StockSymbol } from '@/types'
import { searchLocalStockCatalog } from './stockCatalog'

export type MockFixtureMode = 'normal' | 'empty' | 'extreme' | 'flat' | 'uptrend' | 'downtrend'

interface MockMarketDataOptions {
  seed?: string
  fixtureMode?: MockFixtureMode
  mockError?: boolean
}

interface SymbolSession {
  candles: Candle[]
  rng: () => number
  step: number
}

const BASE_TIME_MS = Date.UTC(2026, 4, 6, 1, 30, 0)
const ONE_MINUTE_MS = 60 * 1000
const DEFAULT_SEED = 'stock-signal-mvp'

const RANGE_LENGTH: Record<CandleRange, number> = {
  '1D': 60,
  '5D': 120,
  '1M': 180,
  '3M': 240,
}

export class MockMarketDataService implements MarketDataService {
  private readonly seed: string
  private fixtureMode: MockFixtureMode
  private mockError: boolean
  private readonly sessions = new Map<string, SymbolSession>()

  constructor(options: MockMarketDataOptions = {}) {
    this.seed = options.seed ?? DEFAULT_SEED
    this.fixtureMode = options.fixtureMode ?? 'normal'
    this.mockError = options.mockError ?? false
  }

  setMockError(enabled: boolean): void {
    this.mockError = enabled
  }

  setFixtureMode(mode: MockFixtureMode): void {
    this.fixtureMode = mode
  }

  async getQuote(symbol: string): Promise<Quote> {
    this.throwIfMockError()

    const candles = this.getCandlesForMode(symbol, '1D', true)
    const latest = candles[candles.length - 1]

    if (!latest) {
      throw new Error(`No mock quote is available for ${symbol}.`)
    }

    const previous = candles[candles.length - 2] ?? latest

    return {
      symbol,
      currentPrice: latest.close,
      openPrice: latest.open,
      highPrice: latest.high,
      lowPrice: latest.low,
      previousClose: previous.close,
      volume: latest.volume,
      changeAmount: roundTo(latest.close - previous.close, 2),
      changePercent: previous.close > 0 ? roundTo(((latest.close - previous.close) / previous.close) * 100, 2) : 0,
      updatedAt: latest.timestamp,
    }
  }

  async getCandles(symbol: string, range: CandleRange): Promise<Candle[]> {
    this.throwIfMockError()
    return this.getCandlesForMode(symbol, range, true)
  }

  async searchStocks(keyword: string, options: StockSearchOptions = {}): Promise<StockSymbol[]> {
    this.throwIfMockError()
    return searchLocalStockCatalog(keyword, options.market)
  }

  private getCandlesForMode(symbol: string, range: CandleRange, shouldAdvance: boolean): Candle[] {
    const length = RANGE_LENGTH[range]

    if (this.fixtureMode !== 'normal') {
      return createFixtureCandles(symbol, this.fixtureMode, length)
    }

    const session = this.getOrCreateSession(symbol)

    if (shouldAdvance) {
      session.candles.push(this.createNextCandle(symbol, session))
      session.step += 1
    }

    return session.candles.slice(-length)
  }

  private getOrCreateSession(symbol: string): SymbolSession {
    const existingSession = this.sessions.get(symbol)

    if (existingSession) {
      return existingSession
    }

    const rng = mulberry32(hashString(`${this.seed}:${symbol}`))
    const basePrice = getBasePrice(symbol)
    const session: SymbolSession = {
      candles: [],
      rng,
      step: 0,
    }

    let previousClose = basePrice

    for (let index = 0; index < RANGE_LENGTH['3M']; index += 1) {
      const candle = createGeneratedCandle(symbol, index, previousClose, rng)
      session.candles.push(candle)
      previousClose = candle.close
      session.step = index + 1
    }

    this.sessions.set(symbol, session)
    return session
  }

  private createNextCandle(symbol: string, session: SymbolSession): Candle {
    const previousClose = session.candles[session.candles.length - 1]?.close ?? getBasePrice(symbol)
    return createGeneratedCandle(symbol, session.step, previousClose, session.rng)
  }

  private throwIfMockError(): void {
    if (this.mockError) {
      throw new Error('Mock market data error is enabled.')
    }
  }
}

export const mockMarketDataService = new MockMarketDataService()

function createGeneratedCandle(
  symbol: string,
  step: number,
  previousClose: number,
  rng: () => number,
): Candle {
  const drift = (rng() - 0.48) * 0.018
  const close = roundTo(Math.max(0.01, previousClose * (1 + drift)), 2)
  const spread = Math.max(0.01, close * (0.002 + rng() * 0.008))
  const high = roundTo(Math.max(previousClose, close) + spread, 2)
  const low = roundTo(Math.max(0.01, Math.min(previousClose, close) - spread), 2)
  const open = roundTo(previousClose, 2)
  const volume = Math.round(200_000 + rng() * 1_800_000)

  return {
    symbol,
    timestamp: formatTimestamp(step),
    open,
    high,
    low,
    close,
    volume,
  }
}

function createFixtureCandles(symbol: string, mode: Exclude<MockFixtureMode, 'normal'>, length: number): Candle[] {
  if (mode === 'empty') {
    return []
  }

  const prices = Array.from({ length }, (_, index) => getFixturePrice(mode, index, length))
  return prices.map((close, index) => ({
    symbol,
    timestamp: formatTimestamp(index),
    open: close,
    high: roundTo(close * 1.01, 2),
    low: roundTo(close * 0.99, 2),
    close,
    volume: 500_000 + index * 1000,
  }))
}

function getFixturePrice(mode: Exclude<MockFixtureMode, 'normal'>, index: number, length: number): number {
  if (mode === 'flat') {
    return 100
  }

  if (mode === 'uptrend') {
    return roundTo(80 + index * 0.4, 2)
  }

  if (mode === 'downtrend') {
    return roundTo(120 - index * 0.35, 2)
  }

  const direction = index % 2 === 0 ? 1 : -1
  return roundTo(100 + direction * (8 + (index % 7) * 3) + length * 0.01, 2)
}

function getBasePrice(symbol: string): number {
  if (symbol.startsWith('600519')) {
    return 1680
  }

  if (symbol.startsWith('300750')) {
    return 210
  }

  if (symbol.startsWith('430047')) {
    return 18
  }

  return 12
}

function formatTimestamp(step: number): string {
  return new Date(BASE_TIME_MS + step * ONE_MINUTE_MS).toISOString()
}

function roundTo(value: number, digits: number): number {
  return Number(value.toFixed(digits))
}

function hashString(value: string): number {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  let state = seed

  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}
