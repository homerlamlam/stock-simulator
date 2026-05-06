// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_WATCHLIST } from '@/config'
import type { StockSymbol } from '@/types'
import { WatchlistPanel } from './WatchlistPanel'

afterEach(() => {
  cleanup()
})

describe('WatchlistPanel', () => {
  it('adds a valid A-share symbol through visible controls', () => {
    const onAddStock = vi.fn()

    renderPanel({ onAddStock })

    fireEvent.change(screen.getByPlaceholderText('600519.SH'), {
      target: { value: '430047.bj' },
    })
    fireEvent.click(screen.getByRole('button', { name: '添加' }))

    expect(onAddStock).toHaveBeenCalledWith({
      code: '430047',
      displayCode: '430047.BJ',
      exchange: 'BJ',
      market: 'CN',
      name: '430047.BJ',
    })
  })

  it('shows an error for invalid symbols', () => {
    renderPanel()

    fireEvent.change(screen.getByPlaceholderText('600519.SH'), {
      target: { value: 'abc' },
    })
    fireEvent.click(screen.getByRole('button', { name: '添加' }))

    expect(screen.getByText(/股票代码格式/)).toBeTruthy()
  })

  it('shows an error for duplicate symbols', () => {
    renderPanel()

    fireEvent.change(screen.getByPlaceholderText('600519.SH'), {
      target: { value: '600519.SH' },
    })
    fireEvent.click(screen.getByRole('button', { name: '添加' }))

    expect(screen.getByText('该股票已在自选股中。')).toBeTruthy()
  })

  it('calls remove when the delete button is clicked', () => {
    const onRemoveStock = vi.fn()

    renderPanel({ onRemoveStock })

    fireEvent.click(screen.getByRole('button', { name: '删除 600519.SH' }))

    expect(onRemoveStock).toHaveBeenCalledWith('600519.SH')
  })
})

interface RenderPanelOverrides {
  onAddStock?: (stock: StockSymbol) => void
  onRemoveStock?: (displayCode: string) => void
}

function renderPanel(overrides: RenderPanelOverrides = {}) {
  return render(
    <WatchlistPanel
      onAddStock={overrides.onAddStock ?? vi.fn()}
      onRemoveStock={overrides.onRemoveStock ?? vi.fn()}
      onResetWatchlist={vi.fn()}
      onSelectStock={vi.fn()}
      selectedSymbol="600519.SH"
      watchlist={DEFAULT_WATCHLIST}
    />,
  )
}
