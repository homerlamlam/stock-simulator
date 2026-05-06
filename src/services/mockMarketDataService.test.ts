import { describe, expect, it } from 'vitest'
import { MockMarketDataService } from './mockMarketDataService'

describe('MockMarketDataService', () => {
  it('generates reproducible initial candles for the same seed and symbol', async () => {
    const firstService = new MockMarketDataService({ seed: 'same-seed' })
    const secondService = new MockMarketDataService({ seed: 'same-seed' })

    const firstCandles = await firstService.getCandles('600519.SH', '1D')
    const secondCandles = await secondService.getCandles('600519.SH', '1D')

    expect(firstCandles).toEqual(secondCandles)
  })

  it('keeps the same symbol continuous within one session', async () => {
    const service = new MockMarketDataService({ seed: 'continuous-seed' })

    const firstCandles = await service.getCandles('000001.SZ', '1D')
    const secondCandles = await service.getCandles('000001.SZ', '1D')

    expect(secondCandles[secondCandles.length - 2]).toEqual(firstCandles[firstCandles.length - 1])
  })

  it('throws a predictable error when mock error is enabled', async () => {
    const service = new MockMarketDataService({ mockError: true })

    await expect(service.getQuote('600519.SH')).rejects.toThrow('Mock market data error is enabled.')
  })

  it('supports empty, flat, extreme, uptrend, and downtrend fixtures', async () => {
    const service = new MockMarketDataService()

    service.setFixtureMode('empty')
    await expect(service.getCandles('600519.SH', '1D')).resolves.toEqual([])

    service.setFixtureMode('flat')
    expect(new Set((await service.getCandles('600519.SH', '1D')).map((candle) => candle.close)).size).toBe(1)

    service.setFixtureMode('extreme')
    expect((await service.getCandles('600519.SH', '1D'))[1]?.close).not.toBe(
      (await service.getCandles('600519.SH', '1D'))[0]?.close,
    )

    service.setFixtureMode('uptrend')
    const uptrend = await service.getCandles('600519.SH', '1D')
    expect(uptrend[uptrend.length - 1]?.close).toBeGreaterThan(uptrend[0]?.close ?? 0)

    service.setFixtureMode('downtrend')
    const downtrend = await service.getCandles('600519.SH', '1D')
    expect(downtrend[downtrend.length - 1]?.close).toBeLessThan(downtrend[0]?.close ?? 0)
  })

  it('searches built-in stocks by code, display code, and name', async () => {
    const service = new MockMarketDataService()

    expect(await service.searchStocks('600519')).toHaveLength(1)
    expect(await service.searchStocks('000001.SZ')).toHaveLength(1)
    expect(await service.searchStocks('茅台')).toHaveLength(1)
  })
})
