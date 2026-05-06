import { describe, expect, it } from 'vitest'
import { DEFAULT_STRATEGY_SETTINGS } from '@/config'
import type { Candle, Quote, StrategySettings } from '@/types'
import { generateTradeSignal } from './signals'

const symbol = '600519.SH'
const updatedAt = '2026-05-06T10:00:00+08:00'

describe('generateTradeSignal', () => {
  it('generates TAKE_PROFIT when simulated profit reaches the threshold', () => {
    const signal = generateTradeSignal({
      symbol,
      quote: createQuote(104),
      candles: createCandles([100, 101, 102, 103, 104]),
      settings: createSettings(),
      position: { symbol, buyPrice: 100, quantity: 100 },
    })

    expect(signal.type).toBe('TAKE_PROFIT')
    expect(signal.reasons.length).toBeGreaterThan(0)
    expect(signal.updatedAt).toBe(updatedAt)
  })

  it('generates STOP_LOSS when simulated loss reaches the threshold', () => {
    const signal = generateTradeSignal({
      symbol,
      quote: createQuote(97),
      candles: createCandles([100, 99, 98, 97]),
      settings: createSettings(),
      position: { symbol, buyPrice: 100, quantity: 100 },
    })

    expect(signal.type).toBe('STOP_LOSS')
    expect(signal.riskLevel).toBe('HIGH')
    expect(signal.reasons.length).toBeGreaterThan(0)
  })

  it('generates HIGH_RISK for sharp recent drops', () => {
    const signal = generateTradeSignal({
      symbol,
      quote: createQuote(94),
      candles: createCandles([100, 99, 98, 94]),
      settings: createSettings(),
    })

    expect(signal.type).toBe('HIGH_RISK')
    expect(signal.riskLevel).toBe('HIGH')
  })

  it('generates BUY_DIP when short MA is above long MA and RSI is not overbought', () => {
    const signal = generateTradeSignal({
      symbol,
      quote: createQuote(12.2),
      candles: createCandles([
        10, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11, 11.1, 11.2, 11.3, 11.4,
        11.5, 11.6, 11.7, 11.8, 12.2,
      ]),
      settings: createSettings({ rsiOverbought: 101 }),
    })

    expect(signal.type).toBe('BUY_DIP')
    expect(signal.reasons.length).toBeGreaterThan(0)
  })

  it('generates WATCH when no clear condition is present', () => {
    const signal = generateTradeSignal({
      symbol,
      quote: createQuote(10),
      candles: createCandles(Array.from({ length: 20 }, () => 10)),
      settings: createSettings(),
    })

    expect(signal.type).toBe('WATCH')
    expect(signal.riskLevel).toBe('LOW')
    expect(signal.reasons.length).toBeGreaterThan(0)
  })

  it('handles strategy boundary values without non-finite confidence', () => {
    const signal = generateTradeSignal({
      symbol,
      quote: createQuote(10),
      candles: createCandles([10]),
      settings: createSettings({
        shortMaPeriod: 0,
        longMaPeriod: 0,
        rsiPeriod: 0,
      }),
    })

    expect(Number.isFinite(signal.confidence)).toBe(true)
    expect(signal.indicators.shortMa).toBeNull()
    expect(signal.indicators.longMa).toBeNull()
    expect(signal.indicators.rsi).toBeNull()
  })
})

function createSettings(overrides: Partial<StrategySettings> = {}): StrategySettings {
  return {
    ...DEFAULT_STRATEGY_SETTINGS,
    ...overrides,
  }
}

function createQuote(currentPrice: number): Quote {
  return {
    symbol,
    currentPrice,
    openPrice: currentPrice,
    highPrice: currentPrice,
    lowPrice: currentPrice,
    previousClose: currentPrice,
    volume: 1000,
    changeAmount: 0,
    changePercent: 0,
    updatedAt,
  }
}

function createCandles(closes: number[]): Candle[] {
  return closes.map((close, index) => ({
    symbol,
    timestamp: `2026-05-06T09:${String(index).padStart(2, '0')}:00+08:00`,
    open: close,
    high: close,
    low: close,
    close,
    volume: 1000,
  }))
}
