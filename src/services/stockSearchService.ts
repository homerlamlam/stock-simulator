import { getDataSourceStatus } from '@/store'
import type { DataSourceMode, Market, StockSymbol } from '@/types'
import { searchLocalStockCatalog } from './stockCatalog'
import { searchTushareStocks } from './tushareStockService'

export type StockSearchSource = 'local' | 'real' | 'fallback'

export interface StockSearchResult {
  results: StockSymbol[]
  source: StockSearchSource
  message: string | null
}

interface SearchStocksInput {
  keyword: string
  market?: Market
  mode: DataSourceMode
}

export async function searchStocksWithFallback({
  keyword,
  market,
  mode,
}: SearchStocksInput): Promise<StockSearchResult> {
  const localResults = searchLocalStockCatalog(keyword, market)

  if (mode === 'mock') {
    return {
      results: localResults,
      source: 'local',
      message: null,
    }
  }

  const status = getDataSourceStatus(mode)

  if (!status.canRequestMarketData) {
    return {
      results: localResults,
      source: 'fallback',
      message: '真实搜索 API 尚未配置，当前显示本地缓存结果。',
    }
  }

  if (localResults.length > 0 && (market !== 'CN' || mode === 'hybrid')) {
    return {
      results: localResults,
      source: 'local',
      message: mode === 'hybrid' ? '已优先命中本地缓存，未额外请求真实搜索 API。' : null,
    }
  }

  try {
    return await searchRealStocks(keyword, market)
  } catch {
    return {
      results: localResults,
      source: 'fallback',
      message: '真实搜索 API 暂不可用，已回退到本地缓存结果。',
    }
  }
}

async function searchRealStocks(keyword: string, market?: Market): Promise<StockSearchResult> {
  if (market === 'CN') {
    return {
      results: await searchTushareStocks(keyword),
      source: 'real',
      message: '搜索结果来自 Tushare A股基础信息。',
    }
  }

  return {
    results: searchLocalStockCatalog(keyword, market),
    source: 'fallback',
    message: '当前真实搜索仅接入 A股，港股/美股暂用本地缓存。',
  }
}
