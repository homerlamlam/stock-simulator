import { calculateIndicators } from '@/utils/indicators'
import type { Candle, PaperPosition, Quote, StrategySettings, TradeSignal } from '@/types'

interface GenerateTradeSignalInput {
  symbol: string
  quote: Quote
  candles: Candle[]
  settings: StrategySettings
  position?: PaperPosition
}

export function generateTradeSignal(input: GenerateTradeSignalInput): TradeSignal {
  const { symbol, quote, candles, settings, position } = input
  const indicators = calculateIndicators(
    candles,
    settings.shortMaPeriod,
    settings.longMaPeriod,
    settings.rsiPeriod,
  )
  const reasons: string[] = []
  const suggestedPriceRange = createSuggestedPriceRange(quote.currentPrice)
  const profitPercent = position ? calculateProfitPercent(position.buyPrice, quote.currentPrice) : null
  const recentDropPercent = calculateRecentDropPercent(candles)

  if (profitPercent !== null && profitPercent >= settings.takeProfitPercent) {
    reasons.push(`模拟持仓收益达到 ${roundTo(profitPercent, 2)}%，超过止盈阈值。`)

    return {
      symbol,
      type: 'TAKE_PROFIT',
      confidence: clampConfidence(78 + profitPercent),
      riskLevel: 'MEDIUM',
      suggestedPriceRange,
      reasons,
      indicators,
      updatedAt: quote.updatedAt,
    }
  }

  if (profitPercent !== null && profitPercent <= -settings.stopLossPercent) {
    reasons.push(`模拟持仓亏损达到 ${roundTo(Math.abs(profitPercent), 2)}%，超过止损阈值。`)

    return {
      symbol,
      type: 'STOP_LOSS',
      confidence: clampConfidence(80 + Math.abs(profitPercent)),
      riskLevel: 'HIGH',
      suggestedPriceRange,
      reasons,
      indicators,
      updatedAt: quote.updatedAt,
    }
  }

  if ((indicators.volatility ?? 0) >= 5 || recentDropPercent <= -3) {
    reasons.push('短期波动明显放大或价格快速下跌，优先控制风险。')

    return {
      symbol,
      type: 'HIGH_RISK',
      confidence: clampConfidence(72 + (indicators.volatility ?? 0)),
      riskLevel: 'HIGH',
      suggestedPriceRange,
      reasons,
      indicators,
      updatedAt: quote.updatedAt,
    }
  }

  if (isBuyDipSignal(indicators.shortMa, indicators.longMa, indicators.rsi, settings.rsiOverbought)) {
    reasons.push('短期均线强于长期均线，且 RSI 未进入超买区。')

    return {
      symbol,
      type: 'BUY_DIP',
      confidence: clampConfidence(68 + ((settings.rsiOverbought - (indicators.rsi ?? 50)) / 2)),
      riskLevel: 'MEDIUM',
      suggestedPriceRange,
      reasons,
      indicators,
      updatedAt: quote.updatedAt,
    }
  }

  if (isOversoldNearRecentLow(candles, quote.currentPrice, indicators.rsi, settings.rsiOversold)) {
    reasons.push('RSI 处于偏低区间，当前价格接近期内低位。')

    return {
      symbol,
      type: 'BUY_DIP',
      confidence: 70,
      riskLevel: 'MEDIUM',
      suggestedPriceRange,
      reasons,
      indicators,
      updatedAt: quote.updatedAt,
    }
  }

  reasons.push('当前指标没有形成明确机会，继续观察更稳妥。')

  return {
    symbol,
    type: 'WATCH',
    confidence: 60,
    riskLevel: 'LOW',
    suggestedPriceRange,
    reasons,
    indicators,
    updatedAt: quote.updatedAt,
  }
}

function isBuyDipSignal(
  shortMa: number | null,
  longMa: number | null,
  rsi: number | null,
  rsiOverbought: number,
): boolean {
  return shortMa !== null && longMa !== null && rsi !== null && shortMa > longMa && rsi < rsiOverbought
}

function isOversoldNearRecentLow(
  candles: Candle[],
  currentPrice: number,
  rsi: number | null,
  rsiOversold: number,
): boolean {
  if (rsi === null || rsi > rsiOversold || candles.length === 0) {
    return false
  }

  const recentLows = candles.slice(-20).map((candle) => candle.low)
  const recentLow = Math.min(...recentLows)

  return currentPrice <= recentLow * 1.02
}

function createSuggestedPriceRange(currentPrice: number): { low: number; high: number } | null {
  if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
    return null
  }

  return {
    low: roundTo(currentPrice * 0.99, 2),
    high: roundTo(currentPrice * 1.01, 2),
  }
}

function calculateProfitPercent(buyPrice: number, currentPrice: number): number {
  if (!Number.isFinite(buyPrice) || buyPrice <= 0) {
    return 0
  }

  return ((currentPrice - buyPrice) / buyPrice) * 100
}

function calculateRecentDropPercent(candles: Candle[]): number {
  const recentCandles = candles.slice(-4)

  if (recentCandles.length < 2) {
    return 0
  }

  const firstClose = recentCandles[0]?.close ?? 0
  const lastClose = recentCandles[recentCandles.length - 1]?.close ?? firstClose

  if (firstClose <= 0) {
    return 0
  }

  return ((lastClose - firstClose) / firstClose) * 100
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) {
    return 60
  }

  return Math.max(0, Math.min(100, Math.round(value)))
}

function roundTo(value: number, digits: number): number {
  return Number(value.toFixed(digits))
}
