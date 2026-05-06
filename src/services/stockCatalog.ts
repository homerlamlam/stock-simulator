import { DEFAULT_WATCHLIST } from '@/config'
import type { Market, StockSymbol } from '@/types'

export const STOCK_CATALOG: StockSymbol[] = [
  ...DEFAULT_WATCHLIST,
  {
    symbol: '430047.BJ',
    code: '430047',
    exchange: 'BJ',
    market: 'CN',
    displayCode: '430047',
    name: '诺思兰德',
  },
  {
    symbol: '00700.HK',
    code: '00700',
    exchange: 'HKEX',
    market: 'HK',
    displayCode: '00700',
    name: '腾讯控股',
  },
  {
    symbol: '09988.HK',
    code: '09988',
    exchange: 'HKEX',
    market: 'HK',
    displayCode: '09988',
    name: '阿里巴巴-W',
  },
  {
    symbol: 'AAPL.NASDAQ',
    code: 'AAPL',
    exchange: 'NASDAQ',
    market: 'US',
    displayCode: 'AAPL',
    name: 'Apple Inc.',
  },
  {
    symbol: 'TSLA.NASDAQ',
    code: 'TSLA',
    exchange: 'NASDAQ',
    market: 'US',
    displayCode: 'TSLA',
    name: 'Tesla Inc.',
  },
]

export function searchLocalStockCatalog(keyword: string, market?: Market): StockSymbol[] {
  const normalizedKeyword = keyword.trim().toUpperCase()
  const stocksByMarket = market ? STOCK_CATALOG.filter((stock) => stock.market === market) : STOCK_CATALOG

  if (!normalizedKeyword) {
    return stocksByMarket
  }

  return stocksByMarket.filter(
    (stock) =>
      stock.symbol.includes(normalizedKeyword) ||
      stock.displayCode.includes(normalizedKeyword) ||
      stock.code.includes(normalizedKeyword) ||
      stock.name.toUpperCase().includes(normalizedKeyword),
  )
}
