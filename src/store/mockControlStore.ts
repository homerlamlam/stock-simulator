import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DataSourceErrorMode, MockFixtureMode } from '@/services'
import { createLocalJsonStorage } from './persistStorage'

interface MockControlState {
  mockError: boolean
  fixtureMode: MockFixtureMode
  dataSourceErrorMode: DataSourceErrorMode
  refreshIntervalMs: number
  setMockError: (enabled: boolean) => void
  setFixtureMode: (mode: MockFixtureMode) => void
  setDataSourceErrorMode: (mode: DataSourceErrorMode) => void
  setRefreshIntervalMs: (value: number) => void
}

export const useMockControlStore = create<MockControlState>()(
  persist(
    (set) => ({
      mockError: false,
      fixtureMode: 'normal',
      dataSourceErrorMode: 'none',
      refreshIntervalMs: 5000,
      setMockError: (enabled) => set({ mockError: enabled }),
      setFixtureMode: (mode) => set({ fixtureMode: mode }),
      setDataSourceErrorMode: (mode) => set({ dataSourceErrorMode: mode }),
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
        dataSourceErrorMode: state.dataSourceErrorMode,
        refreshIntervalMs: state.refreshIntervalMs,
      }),
    },
  ),
)
