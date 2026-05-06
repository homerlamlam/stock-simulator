import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_WATCHLIST } from '@/config'
import type { StockSymbol } from '@/types'
import { createLocalJsonStorage } from './persistStorage'

interface WatchlistState {
  watchlist: StockSymbol[]
  selectedSymbol: string | null
  addStock: (stock: StockSymbol) => void
  removeStock: (displayCode: string) => void
  selectStock: (displayCode: string | null) => void
  clearWatchlist: () => void
  resetWatchlist: () => void
}

const defaultSelectedSymbol = DEFAULT_WATCHLIST[0]?.symbol ?? null

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      watchlist: DEFAULT_WATCHLIST,
      selectedSymbol: defaultSelectedSymbol,
      addStock: (stock) =>
        set((state) => {
          const alreadyExists = state.watchlist.some((item) => item.symbol === stock.symbol)

          if (alreadyExists) {
            return state
          }

          return {
            watchlist: [...state.watchlist, stock],
            selectedSymbol: state.selectedSymbol ?? stock.symbol,
          }
        }),
      removeStock: (symbol) =>
        set((state) => {
          const nextWatchlist = state.watchlist.filter((stock) => stock.symbol !== symbol)
          const shouldMoveSelection = state.selectedSymbol === symbol

          return {
            watchlist: nextWatchlist,
            selectedSymbol: shouldMoveSelection ? (nextWatchlist[0]?.symbol ?? null) : state.selectedSymbol,
          }
        }),
      selectStock: (symbol) =>
        set((state) => ({
          selectedSymbol:
            symbol === null || state.watchlist.some((stock) => stock.symbol === symbol)
              ? symbol
              : state.selectedSymbol,
        })),
      clearWatchlist: () =>
        set({
          watchlist: [],
          selectedSymbol: null,
        }),
      resetWatchlist: () =>
        set({
          watchlist: DEFAULT_WATCHLIST,
          selectedSymbol: defaultSelectedSymbol,
        }),
    }),
    {
      name: 'stock-signal-watchlist',
      storage: createLocalJsonStorage(),
      partialize: (state) => ({
        watchlist: state.watchlist,
        selectedSymbol: state.selectedSymbol,
      }),
    },
  ),
)
