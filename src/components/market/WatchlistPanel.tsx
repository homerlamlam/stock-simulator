import { StateNotice } from '@/components/common'
import type { Market, StockSymbol } from '@/types'

interface WatchlistPanelProps {
  market: Market
  searchKeyword: string
  searchResults: StockSymbol[]
  searchMessage: string | null
  watchlist: StockSymbol[]
  selectedSymbol: string | null
  isSearchLoading: boolean
  onAddStock: (stock: StockSymbol) => void
  onMarketChange: (market: Market) => void
  onRemoveStock: (symbol: string) => void
  onResetWatchlist: () => void
  onSearchKeywordChange: (keyword: string) => void
  onSelectStock: (symbol: string) => void
}

const marketOptions: Array<{ label: string; value: Market }> = [
  { label: 'A股', value: 'CN' },
  { label: '港股', value: 'HK' },
  { label: '美股', value: 'US' },
]

export function WatchlistPanel({
  isSearchLoading,
  market,
  onAddStock,
  onMarketChange,
  onRemoveStock,
  onResetWatchlist,
  onSearchKeywordChange,
  onSelectStock,
  searchKeyword,
  searchMessage,
  searchResults,
  selectedSymbol,
  watchlist,
}: WatchlistPanelProps) {
  const visibleWatchlist = watchlist.filter((stock) => stock.market === market)

  return (
    <aside className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-950">自选股</h2>
        <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
          {visibleWatchlist.length} 只
        </span>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {marketOptions.map((option) => (
          <button
            className={`h-9 rounded-lg border px-2 text-sm font-semibold transition ${
              market === option.value
                ? 'border-orange-300 bg-orange-50 text-orange-800'
                : 'border-slate-200 bg-white text-slate-600 hover:border-orange-200'
            }`}
            key={option.value}
            onClick={() => onMarketChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mb-4 space-y-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">搜索股票</span>
          <input
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold uppercase text-slate-950 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="代码或名称"
            value={searchKeyword}
          />
        </label>

        <div className="max-h-44 space-y-2 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50 p-2">
          {isSearchLoading ? (
            <p className="px-2 py-2 text-sm text-slate-500">搜索中...</p>
          ) : searchResults.length === 0 ? (
            <p className="px-2 py-2 text-sm text-slate-500">没有匹配结果</p>
          ) : (
            searchResults.map((stock) => {
              const alreadyAdded = watchlist.some((item) => item.symbol === stock.symbol)

              return (
                <button
                  className="w-full rounded-lg bg-white px-3 py-2 text-left text-sm transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={alreadyAdded}
                  key={stock.symbol}
                  onClick={() => onAddStock(stock)}
                  type="button"
                >
                  <span className="block font-semibold text-slate-950">{stock.displayCode}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {stock.name} · {getMarketLabel(stock.market)}
                  </span>
                </button>
              )
            })
          )}
        </div>
        {searchMessage ? <p className="text-xs leading-5 text-amber-700">{searchMessage}</p> : null}
      </div>

      {visibleWatchlist.length === 0 ? (
        <StateNotice
          actionLabel="恢复默认自选股"
          message="当前市场没有自选股，行情、图表和信号区域可能保持空状态。"
          onAction={onResetWatchlist}
          title="自选股为空"
        />
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {visibleWatchlist.map((stock) => {
            const isSelected = stock.symbol === selectedSymbol

            return (
              <div
                className={`flex min-w-52 items-stretch gap-2 rounded-lg border p-2 transition lg:min-w-0 ${
                  isSelected
                    ? 'border-orange-300 bg-orange-50 text-orange-950'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/60'
                }`}
                key={stock.symbol}
              >
                <button className="min-w-0 flex-1 text-left" onClick={() => onSelectStock(stock.symbol)} type="button">
                  <span className="block text-sm font-semibold">{stock.displayCode}</span>
                  <span className="block truncate text-xs text-slate-500">{stock.name}</span>
                </button>
                <button
                  aria-label={`删除 ${stock.displayCode}`}
                  className="h-8 w-8 shrink-0 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => onRemoveStock(stock.symbol)}
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

function getMarketLabel(market: Market): string {
  if (market === 'HK') {
    return '港股'
  }

  if (market === 'US') {
    return '美股'
  }

  return 'A股'
}
