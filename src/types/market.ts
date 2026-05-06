export type Market = 'CN' | 'US' | 'HK'

export type Exchange = 'SH' | 'SZ' | 'BJ' | 'NYSE' | 'NASDAQ' | 'HKEX'

export type CandleRange = '1D' | '5D' | '1M' | '3M'

export type TrendDirection = 'UP' | 'DOWN' | 'SIDEWAYS' | 'UNKNOWN'

export type SignalType =
  | 'WATCH'
  | 'BUY_DIP'
  | 'TAKE_PROFIT'
  | 'STOP_LOSS'
  | 'HIGH_RISK'

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface StockSymbol {
  symbol: string
  code: string
  exchange: Exchange
  market: Market
  displayCode: string
  name: string
}

export interface StockSearchOptions {
  market?: Market
}

export interface Quote {
  symbol: string
  currentPrice: number
  openPrice: number
  highPrice: number
  lowPrice: number
  previousClose: number
  volume: number
  changeAmount: number
  changePercent: number
  updatedAt: string
}

export interface Candle {
  symbol: string
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface IndicatorResult {
  shortMa: number | null
  longMa: number | null
  rsi: number | null
  volatility: number | null
  trend: TrendDirection
}

export interface StrategySettings {
  shortMaPeriod: number
  longMaPeriod: number
  rsiPeriod: number
  rsiOverbought: number
  rsiOversold: number
  takeProfitPercent: number
  stopLossPercent: number
  minimumConfidence: number
  feeRate: number
}

export interface PaperPosition {
  symbol: string
  buyPrice: number
  quantity: number
}

export interface TradeSignal {
  symbol: string
  type: SignalType
  confidence: number
  riskLevel: RiskLevel
  suggestedPriceRange: {
    low: number
    high: number
  } | null
  reasons: string[]
  indicators: IndicatorResult
  updatedAt: string
}

export interface MarketDataService {
  getQuote(symbol: string): Promise<Quote>
  getCandles(symbol: string, range: CandleRange): Promise<Candle[]>
  searchStocks(keyword: string, options?: StockSearchOptions): Promise<StockSymbol[]>
}
