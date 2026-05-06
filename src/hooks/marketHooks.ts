import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DEFAULT_STRATEGY_SETTINGS } from '@/config'
import { applyMarketDataControls, getMarketDataService } from '@/services'
import { useMockControlStore, useStrategyStore } from '@/store'
import type { CandleRange } from '@/types'
import { generateTradeSignal } from '@/utils'

const DEFAULT_RANGE: CandleRange = '1D'

export function useQuote(symbol: string | null) {
  const controls = useMarketDataControls()

  return useQuery({
    queryKey: ['quote', symbol, controls.mockError, controls.fixtureMode],
    queryFn: () => {
      applyMarketDataControls(controls.mockError, controls.fixtureMode)
      return getMarketDataService().getQuote(symbol ?? '')
    },
    enabled: Boolean(symbol),
    refetchInterval: controls.refreshIntervalMs,
  })
}

export function useCandles(symbol: string | null, range: CandleRange = DEFAULT_RANGE) {
  const controls = useMarketDataControls()

  return useQuery({
    queryKey: ['candles', symbol, range, controls.mockError, controls.fixtureMode],
    queryFn: () => {
      applyMarketDataControls(controls.mockError, controls.fixtureMode)
      return getMarketDataService().getCandles(symbol ?? '', range)
    },
    enabled: Boolean(symbol),
    refetchInterval: controls.refreshIntervalMs,
  })
}

export function useStockSearch(keyword: string) {
  const controls = useMarketDataControls()
  const normalizedKeyword = keyword.trim()

  return useQuery({
    queryKey: ['stock-search', normalizedKeyword, controls.mockError],
    queryFn: () => {
      applyMarketDataControls(controls.mockError, controls.fixtureMode)
      return getMarketDataService().searchStocks(normalizedKeyword)
    },
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
  return useMockControlStore((state) => ({
    mockError: state.mockError,
    fixtureMode: state.fixtureMode,
    refreshIntervalMs: state.refreshIntervalMs,
  }))
}
