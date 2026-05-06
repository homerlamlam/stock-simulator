import { beforeEach, describe, expect, it } from 'vitest'
import { useMockControlStore } from './mockControlStore'

describe('useMockControlStore', () => {
  beforeEach(() => {
    useMockControlStore.setState({
      mockError: false,
      fixtureMode: 'normal',
      refreshIntervalMs: 5000,
    })
  })

  it('updates mock controls', () => {
    useMockControlStore.getState().setMockError(true)
    useMockControlStore.getState().setFixtureMode('flat')
    useMockControlStore.getState().setRefreshIntervalMs(3000)

    expect(useMockControlStore.getState().mockError).toBe(true)
    expect(useMockControlStore.getState().fixtureMode).toBe('flat')
    expect(useMockControlStore.getState().refreshIntervalMs).toBe(3000)
  })

  it('falls back to default refresh interval for invalid values', () => {
    useMockControlStore.getState().setRefreshIntervalMs(0)

    expect(useMockControlStore.getState().refreshIntervalMs).toBe(5000)
  })
})
