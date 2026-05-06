import { describe, expect, it } from 'vitest'
import { getDataSourceStatus, useDataSourceStore } from './dataSourceStore'

describe('dataSourceStore', () => {
  it('defaults to mock mode', () => {
    expect(useDataSourceStore.getState().mode).toBe('mock')
  })

  it('updates selected data source mode', () => {
    useDataSourceStore.getState().setMode('hybrid')

    expect(useDataSourceStore.getState().mode).toBe('hybrid')

    useDataSourceStore.getState().setMode('mock')
  })

  it('marks unconfigured real API as unavailable', () => {
    const status = getDataSourceStatus('real')

    expect(status.code).toBe('not_configured')
    expect(status.canRequestMarketData).toBe(false)
  })

  it('allows hybrid mode to continue with mock fallback when real API is unconfigured', () => {
    const status = getDataSourceStatus('hybrid')

    expect(status.code).toBe('not_configured')
    expect(status.canRequestMarketData).toBe(true)
  })
})
