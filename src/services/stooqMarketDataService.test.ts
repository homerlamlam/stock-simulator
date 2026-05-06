import { describe, expect, it } from 'vitest'
import { mapStooqQuoteResponse } from './stooqMarketDataService'

describe('mapStooqQuoteResponse', () => {
  it('normalizes Stooq quote data into internal Quote shape', () => {
    const quote = mapStooqQuoteResponse('AAPL.NASDAQ', {
      symbols: [
        {
          symbol: 'AAPL.US',
          date: '2026-05-05',
          time: '22:00:18',
          open: 276.925,
          high: 284.57,
          low: 276.501,
          close: 284.18,
          volume: 49311712,
        },
      ],
    })

    expect(quote.symbol).toBe('AAPL.NASDAQ')
    expect(quote.currentPrice).toBe(284.18)
    expect(quote.changePercent).toBe(2.62)
    expect(quote.updatedAt).toBe('2026-05-05T22:00:18.000Z')
  })

  it('rejects malformed provider data', () => {
    expect(() => mapStooqQuoteResponse('AAPL.NASDAQ', { symbols: [{}] })).toThrow()
  })
})
