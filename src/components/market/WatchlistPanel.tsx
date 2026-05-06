import { useState } from 'react'
import { StateNotice } from '@/components/common'
import type { StockSymbol } from '@/types'
import { normalizeStockSymbol } from '@/utils'

interface WatchlistPanelProps {
  watchlist: StockSymbol[]
  selectedSymbol: string | null
  onAddStock: (stock: StockSymbol) => void
  onRemoveStock: (displayCode: string) => void
  onResetWatchlist: () => void
  onSelectStock: (displayCode: string) => void
}

export function WatchlistPanel({
  onAddStock,
  onRemoveStock,
  onResetWatchlist,
  onSelectStock,
  selectedSymbol,
  watchlist,
}: WatchlistPanelProps) {
  const [symbolInput, setSymbolInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleAddStock(): void {
    const result = normalizeStockSymbol(symbolInput)

    if (!result.isValid) {
      setError(result.error)
      return
    }

    const alreadyExists = watchlist.some((stock) => stock.displayCode === result.stock.displayCode)

    if (alreadyExists) {
      setError('该股票已在自选股中。')
      return
    }

    onAddStock(result.stock)
    setSymbolInput('')
    setError(null)
  }

  return (
    <aside className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-950">自选股</h2>
        <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
          {watchlist.length} 只
        </span>
      </div>

      <div className="mb-4 space-y-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">股票代码</span>
          <div className="flex gap-2">
            <input
              className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold uppercase text-slate-950 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
              onChange={(event) => {
                setSymbolInput(event.target.value.toUpperCase())
                setError(null)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleAddStock()
                }
              }}
              placeholder="600519.SH"
              value={symbolInput}
            />
            <button
              className="h-10 rounded-lg bg-orange-600 px-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              onClick={handleAddStock}
              type="button"
            >
              添加
            </button>
          </div>
        </label>
        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      </div>

      {watchlist.length === 0 ? (
        <StateNotice
          actionLabel="恢复默认自选股"
          message="当前没有自选股，行情、图表和信号区域会保持空状态。"
          onAction={onResetWatchlist}
          title="自选股为空"
        />
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {watchlist.map((stock) => {
            const isSelected = stock.displayCode === selectedSymbol

            return (
              <div
                className={`flex min-w-52 items-stretch gap-2 rounded-lg border p-2 transition lg:min-w-0 ${
                  isSelected
                    ? 'border-orange-300 bg-orange-50 text-orange-950'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/60'
                }`}
                key={stock.displayCode}
              >
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => onSelectStock(stock.displayCode)}
                  type="button"
                >
                  <span className="block text-sm font-semibold">{stock.displayCode}</span>
                  <span className="block truncate text-xs text-slate-500">{stock.name}</span>
                </button>
                <button
                  aria-label={`删除 ${stock.displayCode}`}
                  className="h-8 w-8 shrink-0 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => onRemoveStock(stock.displayCode)}
                  type="button"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}
    </aside>
  )
}
