import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_STRATEGY_SETTINGS } from '@/config'
import type { StrategySettings } from '@/types'
import { createLocalJsonStorage } from './persistStorage'

interface StrategyState {
  settings: StrategySettings
  updateSettings: (settings: Partial<StrategySettings>) => void
  resetSettings: () => void
}

export const useStrategyStore = create<StrategyState>()(
  persist(
    (set) => ({
      settings: DEFAULT_STRATEGY_SETTINGS,
      updateSettings: (settings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        })),
      resetSettings: () =>
        set({
          settings: DEFAULT_STRATEGY_SETTINGS,
        }),
    }),
    {
      name: 'stock-signal-strategy',
      storage: createLocalJsonStorage(),
      partialize: (state) => ({
        settings: state.settings,
      }),
    },
  ),
)
