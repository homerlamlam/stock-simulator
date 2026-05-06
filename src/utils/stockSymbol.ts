import type { Exchange, StockSymbol } from '@/types'

export type StockSymbolValidationResult =
  | {
      isValid: true
      stock: StockSymbol
    }
  | {
      isValid: false
      error: string
    }

const CHINA_STOCK_PATTERN = /^(\d{6})\.(SH|SZ|BJ)$/

export function normalizeStockSymbol(input: string): StockSymbolValidationResult {
  const normalizedInput = input.trim().toUpperCase()
  const match = normalizedInput.match(CHINA_STOCK_PATTERN)

  if (!match) {
    return {
      isValid: false,
      error: '股票代码格式应为 6 位数字加交易所后缀，例如 600519.SH、000001.SZ 或 430047.BJ。',
    }
  }

  const [, code, exchange] = match

  if (!code || !exchange) {
    return {
      isValid: false,
      error: '股票代码缺少代码或交易所后缀。',
    }
  }

  return {
    isValid: true,
    stock: {
      code,
      exchange: exchange as Exchange,
      market: 'CN',
      displayCode: `${code}.${exchange}`,
      name: `${code}.${exchange}`,
    },
  }
}
