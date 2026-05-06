import { describe, expect, it } from 'vitest'
import { mapTushareStockBasicResponse } from './tushareStockService'

describe('mapTushareStockBasicResponse', () => {
  it('normalizes Tushare stock_basic rows', () => {
    const profiles = mapTushareStockBasicResponse({
      code: 0,
      msg: '',
      data: {
        fields: ['ts_code', 'symbol', 'name', 'area', 'industry', 'market', 'exchange', 'list_date', 'list_status'],
        items: [['600519.SH', '600519', '贵州茅台', '贵州', '白酒', '主板', 'SSE', '20010827', 'L']],
      },
    })

    expect(profiles[0]).toMatchObject({
      symbol: '600519.SH',
      displayCode: '600519',
      exchange: 'SH',
      area: '贵州',
      industry: '白酒',
      listDate: '2001-08-27',
      dataSource: 'tushare',
    })
  })

  it('drops malformed rows instead of returning invalid stock records', () => {
    const profiles = mapTushareStockBasicResponse({
      code: 0,
      msg: '',
      data: {
        fields: ['ts_code', 'symbol', 'name', 'exchange'],
        items: [['', '', '', 'SSE']],
      },
    })

    expect(profiles).toHaveLength(0)
  })
})
