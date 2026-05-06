import type { StockSymbol, StrategySettings } from '@/types'

export const DEFAULT_MARKET = 'CN' as const

export const DEFAULT_WATCHLIST: StockSymbol[] = [
  {
    symbol: '600519.SH',
    code: '600519',
    exchange: 'SH',
    market: DEFAULT_MARKET,
    displayCode: '600519',
    name: '贵州茅台',
  },
  {
    symbol: '000001.SZ',
    code: '000001',
    exchange: 'SZ',
    market: DEFAULT_MARKET,
    displayCode: '000001',
    name: '平安银行',
  },
  {
    symbol: '300750.SZ',
    code: '300750',
    exchange: 'SZ',
    market: DEFAULT_MARKET,
    displayCode: '300750',
    name: '宁德时代',
  },
]

export const DEFAULT_STRATEGY_SETTINGS: StrategySettings = {
  shortMaPeriod: 5,
  longMaPeriod: 20,
  rsiPeriod: 14,
  rsiOverbought: 70,
  rsiOversold: 30,
  takeProfitPercent: 3,
  stopLossPercent: 2,
  minimumConfidence: 60,
  feeRate: 0.0005,
}
