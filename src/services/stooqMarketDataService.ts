import { STOOQ_PROXY_BASE_URL, isRealDataSourceConfigured } from '@/config'
import type { Candle, CandleRange, MarketDataService, Quote, StockSearchOptions, StockSymbol } from '@/types'
import { createDataSourceError } from './dataSourceErrors'
import { searchLocalStockCatalog } from './stockCatalog'

interface StooqMarketDataServiceOptions {
  fallbackCandlesService: Pick<MarketDataService, 'getCandles'>
  fetchJson?: (url: string) => Promise<unknown>
}

interface StooqQuoteRow {
  symbol: string
  date: string
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface StooqQuoteResponse {
  symbols: StooqQuoteRow[]
}

export class StooqMarketDataService implements MarketDataService {
  private readonly fallbackCandlesService: Pick<MarketDataService, 'getCandles'>
  private readonly fetchJson: (url: string) => Promise<unknown>

  constructor(options: StooqMarketDataServiceOptions) {
    this.fallbackCandlesService = options.fallbackCandlesService
    this.fetchJson = options.fetchJson ?? fetchJson
  }

  async getQuote(symbol: string): Promise<Quote> {
    if (!isRealDataSourceConfigured()) {
      throw createDataSourceError('not_configured')
    }

    const stooqSymbol = toStooqSymbol(symbol)

    if (!stooqSymbol) {
      throw createDataSourceError('unauthorized')
    }

    const url = `${STOOQ_PROXY_BASE_URL}/q/l/?s=${encodeURIComponent(stooqSymbol)}&f=sd2t2ohlcv&h&e=json`
    const response = await this.fetchJson(url)
    return mapStooqQuoteResponse(symbol, response)
  }

  async getCandles(symbol: string, range: CandleRange): Promise<Candle[]> {
    return this.fallbackCandlesService.getCandles(symbol, range)
  }

  async searchStocks(keyword: string, options: StockSearchOptions = {}): Promise<StockSymbol[]> {
    return searchLocalStockCatalog(keyword, options.market)
  }
}

export function mapStooqQuoteResponse(symbol: string, response: unknown): Quote {
  const parsed = parseStooqQuoteResponse(response)
  const row = parsed.symbols[0]

  if (!row || row.close <= 0) {
    throw createDataSourceError('provider_error')
  }

  const previousClose = row.open > 0 ? row.open : row.close
  const updatedAt = new Date(`${row.date}T${row.time}Z`).toISOString()

  return {
    symbol,
    currentPrice: roundTo(row.close, 2),
    openPrice: roundTo(row.open, 2),
    highPrice: roundTo(row.high, 2),
    lowPrice: roundTo(row.low, 2),
    previousClose: roundTo(previousClose, 2),
    volume: Math.max(0, Math.round(row.volume)),
    changeAmount: roundTo(row.close - previousClose, 2),
    changePercent: previousClose > 0 ? roundTo(((row.close - previousClose) / previousClose) * 100, 2) : 0,
    updatedAt,
  }
}

function toStooqSymbol(symbol: string): string | null {
  if (symbol.endsWith('.NASDAQ') || symbol.endsWith('.NYSE')) {
    return `${symbol.split('.')[0].toLowerCase()}.us`
  }

  return null
}

async function fetchJson(url: string): Promise<unknown> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw createDataSourceError(response.status === 429 ? 'rate_limited' : 'provider_error')
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'DataSourceError') {
      throw error
    }

    throw createDataSourceError('network_error')
  }
}

function parseStooqQuoteResponse(response: unknown): StooqQuoteResponse {
  if (!isRecord(response) || !Array.isArray(response.symbols)) {
    throw createDataSourceError('provider_error')
  }

  const symbols = response.symbols.map(parseQuoteRow)
  return { symbols }
}

function parseQuoteRow(value: unknown): StooqQuoteRow {
  if (!isRecord(value)) {
    throw createDataSourceError('provider_error')
  }

  return {
    symbol: readString(value, 'symbol'),
    date: readString(value, 'date'),
    time: readString(value, 'time'),
    open: readNumber(value, 'open'),
    high: readNumber(value, 'high'),
    low: readNumber(value, 'low'),
    close: readNumber(value, 'close'),
    volume: readNumber(value, 'volume'),
  }
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key]

  if (typeof value !== 'string' || value.trim() === '') {
    throw createDataSourceError('provider_error')
  }

  return value
}

function readNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key]
  const numberValue = typeof value === 'number' ? value : Number(value)

  if (!Number.isFinite(numberValue)) {
    throw createDataSourceError('provider_error')
  }

  return numberValue
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function roundTo(value: number, digits: number): number {
  return Number(value.toFixed(digits))
}
