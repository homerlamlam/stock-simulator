import { afterEach, describe, expect, it, vi } from 'vitest'
import { getDataSourceStatus, useDataSourceStore } from './dataSourceStore'

describe('dataSourceStore', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('defaults to mock mode', () => {
    expect(useDataSourceStore.getState().mode).toBe('mock')
  })

  it('updates selected data source mode', () => {
    useDataSourceStore.getState().setMode('hybrid')

    expect(useDataSourceStore.getState().mode).toBe('hybrid')

    useDataSourceStore.getState().setMode('mock')
  })

  it('marks unconfigured real API as unavailable', () => {
    vi.stubEnv('VITE_STOOQ_REAL_ENABLED', 'false')
    vi.stubEnv('VITE_TUSHARE_REAL_ENABLED', 'false')

    const status = getDataSourceStatus('real')

    expect(status.code).toBe('not_configured')
    expect(status.canRequestMarketData).toBe(false)
  })

  it('allows hybrid mode to continue with mock fallback when real API is unconfigured', () => {
    vi.stubEnv('VITE_STOOQ_REAL_ENABLED', 'false')
    vi.stubEnv('VITE_TUSHARE_REAL_ENABLED', 'false')

    const status = getDataSourceStatus('hybrid')

    expect(status.code).toBe('not_configured')
    expect(status.canRequestMarketData).toBe(true)
  })

  it('marks real API as ready when a real provider is enabled', () => {
    vi.stubEnv('VITE_TUSHARE_REAL_ENABLED', 'true')

    const status = getDataSourceStatus('real')

    expect(status.code).toBe('real_ready')
    expect(status.canRequestMarketData).toBe(true)
  })
})
