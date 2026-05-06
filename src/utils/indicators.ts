import type { Candle, IndicatorResult, TrendDirection } from '@/types'

export function calculateMovingAverage(values: number[], period: number): Array<number | null> {
  if (!isValidPeriod(period)) {
    return values.map(() => null)
  }

  return values.map((_, index) => {
    if (index + 1 < period) {
      return null
    }

    const window = values.slice(index + 1 - period, index + 1)
    return roundTo(sum(window) / period, 4)
  })
}

export function calculateLatestMovingAverage(values: number[], period: number): number | null {
  const averages = calculateMovingAverage(values, period)
  return averages[averages.length - 1] ?? null
}

export function calculateRsi(values: number[], period: number): number | null {
  if (!isValidPeriod(period) || values.length <= period) {
    return null
  }

  const changes = values.slice(-period - 1).map((value, index, window) => {
    if (index === 0) {
      return 0
    }

    return value - window[index - 1]
  })

  const relevantChanges = changes.slice(1)
  const gains = relevantChanges.map((change) => Math.max(change, 0))
  const losses = relevantChanges.map((change) => Math.max(-change, 0))
  const averageGain = sum(gains) / period
  const averageLoss = sum(losses) / period

  if (averageGain === 0 && averageLoss === 0) {
    return 50
  }

  if (averageLoss === 0) {
    return 100
  }

  const relativeStrength = averageGain / averageLoss
  return roundTo(100 - 100 / (1 + relativeStrength), 2)
}

export function calculateVolatility(values: number[]): number | null {
  if (values.length < 2) {
    return null
  }

  const returns = values.slice(1).map((value, index) => {
    const previous = values[index]

    if (!previous) {
      return 0
    }

    return (value - previous) / previous
  })

  const averageReturn = sum(returns) / returns.length
  const variance = sum(returns.map((value) => (value - averageReturn) ** 2)) / returns.length
  const volatility = Math.sqrt(variance) * 100

  return ensureFinite(roundTo(volatility, 2))
}

export function calculateIndicators(
  candles: Candle[],
  shortMaPeriod: number,
  longMaPeriod: number,
  rsiPeriod: number,
): IndicatorResult {
  const closes = candles.map((candle) => candle.close)
  const shortMa = calculateLatestMovingAverage(closes, shortMaPeriod)
  const longMa = calculateLatestMovingAverage(closes, longMaPeriod)
  const rsi = calculateRsi(closes, rsiPeriod)
  const volatility = calculateVolatility(closes)

  return {
    shortMa,
    longMa,
    rsi,
    volatility,
    trend: getTrendDirection(shortMa, longMa),
  }
}

function getTrendDirection(shortMa: number | null, longMa: number | null): TrendDirection {
  if (shortMa === null || longMa === null) {
    return 'UNKNOWN'
  }

  const gapPercent = Math.abs(shortMa - longMa) / longMa

  if (gapPercent < 0.002) {
    return 'SIDEWAYS'
  }

  return shortMa > longMa ? 'UP' : 'DOWN'
}

function isValidPeriod(period: number): boolean {
  return Number.isInteger(period) && period > 0
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

function roundTo(value: number, digits: number): number {
  return Number(value.toFixed(digits))
}

function ensureFinite(value: number): number {
  return Number.isFinite(value) ? value : 0
}
