import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_WATCHLIST } from '@/config'
import { useWatchlistStore } from './watchlistStore'

describe('useWatchlistStore', () => {
  beforeEach(() => {
    useWatchlistStore.setState({
      watchlist: DEFAULT_WATCHLIST,
      selectedSymbol: DEFAULT_WATCHLIST[0]?.displayCode ?? null,
    })
  })

  it('adds a stock once and selects it when selection is empty', () => {
    useWatchlistStore.getState().clearWatchlist()
    useWatchlistStore.getState().addStock({
      code: '430047',
      exchange: 'BJ',
      market: 'CN',
      displayCode: '430047.BJ',
      name: '诺思兰德',
    })
    useWatchlistStore.getState().addStock({
      code: '430047',
      exchange: 'BJ',
      market: 'CN',
      displayCode: '430047.BJ',
      name: '诺思兰德',
    })

    expect(useWatchlistStore.getState().watchlist).toHaveLength(1)
    expect(useWatchlistStore.getState().selectedSymbol).toBe('430047.BJ')
  })

  it('moves selection when the selected stock is removed', () => {
    useWatchlistStore.getState().selectStock('000001.SZ')
    useWatchlistStore.getState().removeStock('000001.SZ')

    expect(useWatchlistStore.getState().selectedSymbol).toBe('600519.SH')
  })

  it('represents an empty watchlist state', () => {
    useWatchlistStore.getState().clearWatchlist()

    expect(useWatchlistStore.getState().watchlist).toEqual([])
    expect(useWatchlistStore.getState().selectedSymbol).toBeNull()
  })

  it('restores the default watchlist', () => {
    useWatchlistStore.getState().clearWatchlist()
    useWatchlistStore.getState().resetWatchlist()

    expect(useWatchlistStore.getState().watchlist).toEqual(DEFAULT_WATCHLIST)
    expect(useWatchlistStore.getState().selectedSymbol).toBe('600519.SH')
  })
})
