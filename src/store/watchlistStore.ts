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

const defaultSelectedSymbol = DEFAULT_WATCHLIST[0]?.displayCode ?? null

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      watchlist: DEFAULT_WATCHLIST,
      selectedSymbol: defaultSelectedSymbol,
      addStock: (stock) =>
        set((state) => {
          const alreadyExists = state.watchlist.some((item) => item.displayCode === stock.displayCode)

          if (alreadyExists) {
            return state
          }

          return {
            watchlist: [...state.watchlist, stock],
            selectedSymbol: state.selectedSymbol ?? stock.displayCode,
          }
        }),
      removeStock: (displayCode) =>
        set((state) => {
          const nextWatchlist = state.watchlist.filter((stock) => stock.displayCode !== displayCode)
          const shouldMoveSelection = state.selectedSymbol === displayCode

          return {
            watchlist: nextWatchlist,
            selectedSymbol: shouldMoveSelection ? (nextWatchlist[0]?.displayCode ?? null) : state.selectedSymbol,
          }
        }),
      selectStock: (displayCode) =>
        set((state) => ({
          selectedSymbol:
            displayCode === null || state.watchlist.some((stock) => stock.displayCode === displayCode)
              ? displayCode
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
