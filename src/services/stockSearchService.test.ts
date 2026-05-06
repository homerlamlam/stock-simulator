import { describe, expect, it } from 'vitest'
import { searchStocksWithFallback } from './stockSearchService'

describe('searchStocksWithFallback', () => {
  it('returns local cache results in mock mode', async () => {
    const result = await searchStocksWithFallback({
      keyword: '茅台',
      market: 'CN',
      mode: 'mock',
    })

    expect(result.source).toBe('local')
    expect(result.results[0]?.symbol).toBe('600519.SH')
    expect(result.message).toBeNull()
  })

  it('keeps markets isolated', async () => {
    const result = await searchStocksWithFallback({
      keyword: '腾讯',
      market: 'CN',
      mode: 'mock',
    })

    expect(result.results).toHaveLength(0)
  })

  it('falls back to local cache when real API is not configured', async () => {
    const result = await searchStocksWithFallback({
      keyword: 'AAPL',
      market: 'US',
      mode: 'real',
    })

    expect(result.source).toBe('fallback')
    expect(result.results[0]?.symbol).toBe('AAPL.NASDAQ')
    expect(result.message).toContain('真实搜索 API 尚未配置')
  })
})
