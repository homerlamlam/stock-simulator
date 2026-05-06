import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_STRATEGY_SETTINGS } from '@/config'
import { useStrategyStore } from './strategyStore'

describe('useStrategyStore', () => {
  beforeEach(() => {
    useStrategyStore.setState({
      settings: DEFAULT_STRATEGY_SETTINGS,
    })
  })

  it('updates strategy settings partially', () => {
    useStrategyStore.getState().updateSettings({ shortMaPeriod: 7 })

    expect(useStrategyStore.getState().settings.shortMaPeriod).toBe(7)
    expect(useStrategyStore.getState().settings.longMaPeriod).toBe(DEFAULT_STRATEGY_SETTINGS.longMaPeriod)
  })

  it('resets strategy settings to defaults', () => {
    useStrategyStore.getState().updateSettings({ stopLossPercent: 8 })
    useStrategyStore.getState().resetSettings()

    expect(useStrategyStore.getState().settings).toEqual(DEFAULT_STRATEGY_SETTINGS)
  })
})
