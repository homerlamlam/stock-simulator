// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_WATCHLIST } from '@/config'
import type { Market, StockSymbol } from '@/types'
import { WatchlistPanel } from './WatchlistPanel'

const hkStock: StockSymbol = {
  symbol: '00700.HK',
  code: '00700',
  exchange: 'HKEX',
  market: 'HK',
  displayCode: '00700',
  name: '腾讯控股',
}

afterEach(() => {
  cleanup()
})

describe('WatchlistPanel', () => {
  it('shows market tabs and codes without exchange suffixes', () => {
    renderPanel()

    expect(screen.getByRole('button', { name: 'A股' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '港股' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '美股' })).toBeTruthy()
    expect(screen.getAllByText('600519').length).toBeGreaterThan(0)
    expect(screen.queryByText('600519.SH')).toBeNull()
  })

  it('updates the search keyword through visible controls', () => {
    const onSearchKeywordChange = vi.fn()

    renderPanel({ onSearchKeywordChange })

    fireEvent.change(screen.getByPlaceholderText('代码或名称'), {
      target: { value: '茅台' },
    })

    expect(onSearchKeywordChange).toHaveBeenCalledWith('茅台')
  })

  it('adds a stock from search results', () => {
    const onAddStock = vi.fn()

    renderPanel({
      onAddStock,
      searchResults: [hkStock],
      market: 'HK',
      watchlist: [],
    })

    fireEvent.click(screen.getByRole('button', { name: /00700/ }))

    expect(onAddStock).toHaveBeenCalledWith(hkStock)
  })

  it('disables duplicate search results', () => {
    renderPanel({
      searchResults: [DEFAULT_WATCHLIST[0]],
    })

    const duplicateButtons = screen.getAllByRole('button', { name: /600519/ })
    expect(duplicateButtons.some((button) => button.hasAttribute('disabled'))).toBe(true)
  })

  it('calls remove when the delete button is clicked', () => {
    const onRemoveStock = vi.fn()

    renderPanel({ onRemoveStock })

    fireEvent.click(screen.getByRole('button', { name: '删除 600519' }))

    expect(onRemoveStock).toHaveBeenCalledWith('600519.SH')
  })
})

interface RenderPanelOverrides {
  isSearchLoading?: boolean
  market?: Market
  onAddStock?: (stock: StockSymbol) => void
  onMarketChange?: (market: Market) => void
  onRemoveStock?: (symbol: string) => void
  onSearchKeywordChange?: (keyword: string) => void
  searchKeyword?: string
  searchResults?: StockSymbol[]
  selectedSymbol?: string | null
  watchlist?: StockSymbol[]
}

function renderPanel(overrides: RenderPanelOverrides = {}) {
  return render(
    <WatchlistPanel
      isSearchLoading={overrides.isSearchLoading ?? false}
      market={overrides.market ?? 'CN'}
      onAddStock={overrides.onAddStock ?? vi.fn()}
      onMarketChange={overrides.onMarketChange ?? vi.fn()}
      onRemoveStock={overrides.onRemoveStock ?? vi.fn()}
      onResetWatchlist={vi.fn()}
      onSearchKeywordChange={overrides.onSearchKeywordChange ?? vi.fn()}
      onSelectStock={vi.fn()}
      searchKeyword={overrides.searchKeyword ?? ''}
      searchResults={overrides.searchResults ?? DEFAULT_WATCHLIST}
      selectedSymbol={overrides.selectedSymbol ?? '600519.SH'}
      watchlist={overrides.watchlist ?? DEFAULT_WATCHLIST}
    />,
  )
}
