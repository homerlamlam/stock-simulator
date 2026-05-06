import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DEFAULT_STRATEGY_SETTINGS } from '@/config'
import {
  applyMarketDataControls,
  createDataSourceError,
  getLocalStockProfile,
  getMarketDataService,
  getTushareStockProfile,
  searchStocksWithFallback,
} from '@/services'
import { getDataSourceStatus, useDataSourceStore, useMockControlStore, useStrategyStore } from '@/store'
import type { CandleRange, Market } from '@/types'
import { generateTradeSignal } from '@/utils'

const DEFAULT_RANGE: CandleRange = '1D'

export function useQuote(symbol: string | null) {
  const controls = useMarketDataControls()
  const canRequestMarketData = controls.status.canRequestMarketData

  return useQuery({
    queryKey: [
      'quote',
      symbol,
      controls.dataSourceMode,
      controls.mockError,
      controls.fixtureMode,
      controls.dataSourceErrorMode,
    ],
    queryFn: () => {
      if (controls.dataSourceErrorMode !== 'none') {
        throw createDataSourceError(controls.dataSourceErrorMode)
      }

      applyMarketDataControls(controls.mockError, controls.fixtureMode)
      return getMarketDataService(controls.dataSourceMode).getQuote(symbol ?? '')
    },
    enabled: Boolean(symbol) && canRequestMarketData,
    refetchInterval: controls.refreshIntervalMs,
  })
}

export function useCandles(symbol: string | null, range: CandleRange = DEFAULT_RANGE) {
  const controls = useMarketDataControls()
  const canRequestMarketData = controls.status.canRequestMarketData

  return useQuery({
    queryKey: [
      'candles',
      symbol,
      range,
      controls.dataSourceMode,
      controls.mockError,
      controls.fixtureMode,
      controls.dataSourceErrorMode,
    ],
    queryFn: () => {
      if (controls.dataSourceErrorMode !== 'none') {
        throw createDataSourceError(controls.dataSourceErrorMode)
      }

      applyMarketDataControls(controls.mockError, controls.fixtureMode)
      return getMarketDataService(controls.dataSourceMode).getCandles(symbol ?? '', range)
    },
    enabled: Boolean(symbol) && canRequestMarketData,
    refetchInterval: controls.refreshIntervalMs,
  })
}

export function useStockSearch(keyword: string, market?: Market) {
  const controls = useMarketDataControls()
  const normalizedKeyword = keyword.trim()

  return useQuery({
    queryKey: ['stock-search', normalizedKeyword, market, controls.dataSourceMode, controls.mockError],
    queryFn: () =>
      searchStocksWithFallback({
        keyword: normalizedKeyword,
        market,
        mode: controls.dataSourceMode,
      }),
  })
}

export function useStockProfile(symbol: string | null) {
  const controls = useMarketDataControls()

  return useQuery({
    queryKey: ['stock-profile', symbol, controls.dataSourceMode],
    queryFn: async () => {
      if (!symbol) {
        return null
      }

      if (controls.dataSourceMode !== 'mock' && symbol.endsWith('.SH')) {
        return (await getTushareStockProfile(symbol)) ?? getLocalStockProfile(symbol)
      }

      if (controls.dataSourceMode !== 'mock' && (symbol.endsWith('.SZ') || symbol.endsWith('.BJ'))) {
        return (await getTushareStockProfile(symbol)) ?? getLocalStockProfile(symbol)
      }

      return getLocalStockProfile(symbol)
    },
    enabled: Boolean(symbol),
  })
}

export function useMarketSnapshot(symbol: string | null, range: CandleRange = DEFAULT_RANGE) {
  const quoteQuery = useQuote(symbol)
  const candlesQuery = useCandles(symbol, range)
  const quote = quoteQuery.data ?? null
  const candles = candlesQuery.data ?? []
  const isLoading = quoteQuery.isLoading || candlesQuery.isLoading
  const isError = quoteQuery.isError || candlesQuery.isError
  const error = quoteQuery.error ?? candlesQuery.error ?? null
  const isEmpty = !isLoading && !isError && (!quote || candles.length === 0)

  return {
    quote,
    candles,
    isLoading,
    isError,
    isEmpty,
    error,
    refetch: () => {
      void quoteQuery.refetch()
      void candlesQuery.refetch()
    },
  }
}

export function useSignal(symbol: string | null, range: CandleRange = DEFAULT_RANGE) {
  const snapshot = useMarketSnapshot(symbol, range)
  const settings = useStrategyStore((state) => state.settings)

  const signal = useMemo(() => {
    if (!symbol || !snapshot.quote || snapshot.candles.length === 0) {
      return null
    }

    return generateTradeSignal({
      symbol,
      quote: snapshot.quote,
      candles: snapshot.candles,
      settings: settings ?? DEFAULT_STRATEGY_SETTINGS,
    })
  }, [snapshot.candles, snapshot.quote, settings, symbol])

  return {
    ...snapshot,
    signal,
    isEmpty: snapshot.isEmpty || signal === null,
  }
}

function useMarketDataControls() {
  const mockError = useMockControlStore((state) => state.mockError)
  const fixtureMode = useMockControlStore((state) => state.fixtureMode)
  const dataSourceErrorMode = useMockControlStore((state) => state.dataSourceErrorMode)
  const refreshIntervalMs = useMockControlStore((state) => state.refreshIntervalMs)
  const dataSourceMode = useDataSourceStore((state) => state.mode)
  const status = getDataSourceStatus(dataSourceMode)

  return {
    dataSourceMode,
    dataSourceErrorMode,
    mockError,
    fixtureMode,
    refreshIntervalMs,
    status,
  }
}
