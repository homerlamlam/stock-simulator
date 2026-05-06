import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isRealDataSourceConfigured } from '@/config'
import type { DataSourceMode, DataSourceStatus } from '@/types'
import { createLocalJsonStorage } from './persistStorage'

interface DataSourceState {
  mode: DataSourceMode
  setMode: (mode: DataSourceMode) => void
}

export const useDataSourceStore = create<DataSourceState>()(
  persist(
    (set) => ({
      mode: 'mock',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'stock-signal-data-source',
      storage: createLocalJsonStorage(),
      partialize: (state) => ({
        mode: state.mode,
      }),
    },
  ),
)

export function getDataSourceStatus(mode: DataSourceMode): DataSourceStatus {
  const isRealConfigured = hasRealDataSourceConfig()

  if (mode === 'mock') {
    return {
      code: 'mock',
      label: 'Mock',
      message: '当前使用本地可复现模拟行情。',
      canRequestMarketData: true,
    }
  }

  if (mode === 'hybrid') {
    return {
      code: isRealConfigured ? 'hybrid' : 'not_configured',
      label: 'Hybrid',
      message: isRealConfigured
        ? '将优先使用真实 API，失败时回退到 Mock。'
        : '真实 API 尚未配置，当前会使用 Mock 回退数据。',
      canRequestMarketData: true,
    }
  }

  return {
    code: isRealConfigured ? 'real_ready' : 'not_configured',
    label: 'Real API',
    message: isRealConfigured ? '真实 API 已配置。' : '真实 API 尚未配置，请先设置环境变量。',
    canRequestMarketData: isRealConfigured,
  }
}

function hasRealDataSourceConfig(): boolean {
  return isRealDataSourceConfigured()
}
