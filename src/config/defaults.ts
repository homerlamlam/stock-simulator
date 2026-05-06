import type { StockSymbol, StrategySettings } from '@/types'

export const DEFAULT_MARKET = 'CN' as const

export const DEFAULT_WATCHLIST: StockSymbol[] = [
  {
    code: '600519',
    exchange: 'SH',
    market: DEFAULT_MARKET,
    displayCode: '600519.SH',
    name: '贵州茅台',
  },
  {
    code: '000001',
    exchange: 'SZ',
    market: DEFAULT_MARKET,
    displayCode: '000001.SZ',
    name: '平安银行',
  },
  {
    code: '300750',
    exchange: 'SZ',
    market: DEFAULT_MARKET,
    displayCode: '300750.SZ',
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
