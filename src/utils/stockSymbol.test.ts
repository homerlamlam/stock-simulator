import { describe, expect, it } from 'vitest'
import { normalizeStockSymbol } from './stockSymbol'

describe('normalizeStockSymbol', () => {
  it('normalizes valid SH symbols', () => {
    const result = normalizeStockSymbol('600519.sh')

    expect(result).toEqual({
      isValid: true,
      stock: {
        code: '600519',
        exchange: 'SH',
        market: 'CN',
        displayCode: '600519.SH',
        name: '600519.SH',
      },
    })
  })

  it('accepts valid SZ and BJ symbols', () => {
    expect(normalizeStockSymbol('000001.SZ').isValid).toBe(true)
    expect(normalizeStockSymbol('430047.BJ').isValid).toBe(true)
  })

  it('rejects invalid symbols with a readable error', () => {
    const result = normalizeStockSymbol('abc')

    expect(result.isValid).toBe(false)
    if (!result.isValid) {
      expect(result.error).toContain('股票代码格式')
    }
  })
})
