import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MockFixtureMode } from '@/services'
import { createLocalJsonStorage } from './persistStorage'

interface MockControlState {
  mockError: boolean
  fixtureMode: MockFixtureMode
  refreshIntervalMs: number
  setMockError: (enabled: boolean) => void
  setFixtureMode: (mode: MockFixtureMode) => void
  setRefreshIntervalMs: (value: number) => void
}

export const useMockControlStore = create<MockControlState>()(
  persist(
    (set) => ({
      mockError: false,
      fixtureMode: 'normal',
      refreshIntervalMs: 5000,
      setMockError: (enabled) => set({ mockError: enabled }),
      setFixtureMode: (mode) => set({ fixtureMode: mode }),
      setRefreshIntervalMs: (value) =>
        set({
          refreshIntervalMs: Number.isFinite(value) && value > 0 ? value : 5000,
        }),
    }),
    {
      name: 'stock-signal-mock-control',
      storage: createLocalJsonStorage(),
      partialize: (state) => ({
        mockError: state.mockError,
        fixtureMode: state.fixtureMode,
        refreshIntervalMs: state.refreshIntervalMs,
      }),
    },
  ),
)
