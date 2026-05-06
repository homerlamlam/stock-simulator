import { describe, expect, it } from 'vitest'
import {
  calculateIndicators,
  calculateLatestMovingAverage,
  calculateMovingAverage,
  calculateRsi,
  calculateVolatility,
} from './indicators'
import type { Candle } from '@/types'

describe('moving averages', () => {
  it('calculates aligned moving averages', () => {
    expect(calculateMovingAverage([1, 2, 3, 4, 5], 3)).toEqual([null, null, 2, 3, 4])
  })

  it('returns null values when period is invalid or data is insufficient', () => {
    expect(calculateMovingAverage([1, 2], 0)).toEqual([null, null])
    expect(calculateLatestMovingAverage([1, 2], 3)).toBeNull()
  })
})

describe('RSI', () => {
  it('returns 100 for a continuous rise', () => {
    expect(calculateRsi([1, 2, 3, 4, 5, 6], 5)).toBe(100)
  })

  it('returns 0 for a continuous fall', () => {
    expect(calculateRsi([6, 5, 4, 3, 2, 1], 5)).toBe(0)
  })

  it('returns 50 for flat prices', () => {
    expect(calculateRsi([3, 3, 3, 3, 3, 3], 5)).toBe(50)
  })

  it('returns null when data is insufficient', () => {
    expect(calculateRsi([1, 2, 3], 5)).toBeNull()
  })
})

describe('volatility', () => {
  it('returns zero for flat prices', () => {
    expect(calculateVolatility([10, 10, 10, 10])).toBe(0)
  })

  it('returns a finite value for extreme movement', () => {
    const volatility = calculateVolatility([10, 30, 5, 40])

    expect(volatility).not.toBeNull()
    expect(Number.isFinite(volatility)).toBe(true)
  })

  it('returns null when data is insufficient', () => {
    expect(calculateVolatility([10])).toBeNull()
  })
})

describe('calculateIndicators', () => {
  it('summarizes MA, RSI, volatility, and trend', () => {
    const candles = createCandles([1, 2, 3, 4, 5, 6])
    const indicators = calculateIndicators(candles, 2, 3, 5)

    expect(indicators.shortMa).toBe(5.5)
    expect(indicators.longMa).toBe(5)
    expect(indicators.rsi).toBe(100)
    expect(indicators.volatility).not.toBeNull()
    expect(indicators.trend).toBe('UP')
  })
})

function createCandles(closes: number[]): Candle[] {
  return closes.map((close, index) => ({
    symbol: '600519.SH',
    timestamp: `2026-05-06T09:${String(index).padStart(2, '0')}:00+08:00`,
    open: close,
    high: close,
    low: close,
    close,
    volume: 1000,
  }))
}
