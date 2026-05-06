import { useState } from 'react'
import { PriceChart } from '@/components/charts'
import { StateNotice } from '@/components/common'
import { WatchlistPanel } from '@/components/market'
import { MockControlsPanel } from '@/components/mock'
import { PaperTradePanel } from '@/components/paper-trade'
import { SignalCard } from '@/components/signals'
import { StrategySettingsPanel } from '@/components/strategy'
import { useSignal, useStockSearch } from '@/hooks'
import { useMockControlStore, useStrategyStore, useWatchlistStore } from '@/store'
import type { Market } from '@/types'

function App() {
  const [activeMarket, setActiveMarket] = useState<Market>('CN')
  const [searchKeyword, setSearchKeyword] = useState('')
  const watchlist = useWatchlistStore((state) => state.watchlist)
  const selectedSymbol = useWatchlistStore((state) => state.selectedSymbol)
  const addStock = useWatchlistStore((state) => state.addStock)
  const removeStock = useWatchlistStore((state) => state.removeStock)
  const selectStock = useWatchlistStore((state) => state.selectStock)
  const resetWatchlist = useWatchlistStore((state) => state.resetWatchlist)
  const settings = useStrategyStore((state) => state.settings)
  const updateSettings = useStrategyStore((state) => state.updateSettings)
  const resetSettings = useStrategyStore((state) => state.resetSettings)
  const mockError = useMockControlStore((state) => state.mockError)
  const fixtureMode = useMockControlStore((state) => state.fixtureMode)
  const setMockError = useMockControlStore((state) => state.setMockError)
  const setFixtureMode = useMockControlStore((state) => state.setFixtureMode)
  const stockSearch = useStockSearch(searchKeyword, activeMarket)
  const snapshot = useSignal(selectedSymbol)
  const quote = snapshot.quote
  const selectedStock = watchlist.find((stock) => stock.symbol === selectedSymbol) ?? null

  function handleMarketChange(market: Market): void {
    setActiveMarket(market)
    const firstStockInMarket = watchlist.find((stock) => stock.market === market)
    selectStock(firstStockInMarket?.symbol ?? null)
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 rounded-lg border border-orange-100 bg-white/85 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-orange-700">A 股信号辅助</p>
            <h1 className="text-2xl font-semibold tracking-normal text-slate-950">Stock Signal Simulator</h1>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:flex sm:items-center">
            <StatusPill label="市场" value="模拟行情" />
            <StatusPill label="刷新" value={quote?.updatedAt.slice(11, 16) ?? '等待数据'} />
          </div>
        </header>

        <div className="grid flex-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div>
            <WatchlistPanel
              isSearchLoading={stockSearch.isLoading}
              market={activeMarket}
              onAddStock={addStock}
              onMarketChange={handleMarketChange}
              onRemoveStock={removeStock}
              onResetWatchlist={resetWatchlist}
              onSearchKeywordChange={setSearchKeyword}
              onSelectStock={selectStock}
              searchKeyword={searchKeyword}
              searchResults={stockSearch.data ?? []}
              selectedSymbol={selectedSymbol}
              watchlist={watchlist}
            />
            <MockControlsPanel
              fixtureMode={fixtureMode}
              mockError={mockError}
              onFixtureModeChange={setFixtureMode}
              onMockErrorChange={setMockError}
            />
          </div>

          <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <div className="grid min-w-0 gap-4">
              <section className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">当前标的</p>
                    <h2 className="text-xl font-semibold text-slate-950">
                      {selectedStock ? `${selectedStock.displayCode} ${selectedStock.name}` : '未选择股票'}
                    </h2>
                  </div>
                  <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    {snapshot.isLoading ? '加载中' : '数据已连接'}
                  </span>
                </div>

                {snapshot.isError ? (
                  <div className="mb-4">
                    <StateNotice
                      actionLabel="关闭模拟错误"
                      message={getErrorMessage(snapshot.error)}
                      onAction={() => setMockError(false)}
                      title="行情数据错误"
                      tone="danger"
                    />
                  </div>
                ) : null}

                {!snapshot.isError && snapshot.isEmpty ? (
                  <div className="mb-4">
                    <StateNotice
                      message="当前股票不存在、未选择股票，或数据源没有返回有效 quote/candles。"
                      title="行情数据为空"
                      tone="warning"
                    />
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Metric label="当前价" value={formatPrice(quote?.currentPrice)} />
                  <Metric label="涨跌幅" value={formatPercent(quote?.changePercent)} />
                  <Metric label="成交量" value={formatVolume(quote?.volume)} />
                  <Metric label="更新时间" value={quote?.updatedAt.slice(11, 19) ?? '--'} />
                </div>
              </section>

              <section className="min-h-80 rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
                <SectionHeader title="走势视图" note="价格、均线和成交量" />
                <div className="mt-4">
                  <PriceChart candles={snapshot.candles} isLoading={snapshot.isLoading} settings={settings} />
                </div>
              </section>
            </div>

            <div className="grid gap-4">
              <section className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
                <SectionHeader title="信号推荐" note="辅助分析结果" />
                <SignalCard isLoading={snapshot.isLoading} signal={snapshot.signal} />
              </section>

              <section className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
                <SectionHeader title="策略参数" note="调整后实时影响信号" />
                <StrategySettingsPanel onReset={resetSettings} onUpdate={updateSettings} settings={settings} />
              </section>

              <section className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
                <SectionHeader title="模拟交易" note="本地估算，不会下单" />
                <PaperTradePanel quote={quote} settings={settings} />
              </section>
            </div>
          </section>
        </div>

        <footer className="rounded-lg border border-orange-100 bg-white/85 p-4 text-sm leading-6 text-slate-600 shadow-sm">
          本系统仅用于交易信号辅助分析，当前数据为模拟行情，不构成投资建议，不承诺收益，也不执行自动交易。
        </footer>
      </div>
    </main>
  )
}

interface MetricProps {
  label: string
  value: string
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 truncate text-base font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function StatusPill({ label, value }: MetricProps) {
  return (
    <div className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
      <span className="block text-xs text-orange-700">{label}</span>
      <span className="block text-sm font-semibold text-orange-950">{value}</span>
    </div>
  )
}

interface SectionHeaderProps {
  title: string
  note: string
}

function SectionHeader({ title, note }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <span className="text-right text-xs text-slate-500">{note}</span>
    </div>
  )
}

function formatPrice(value: number | undefined): string {
  return value === undefined ? '--' : value.toFixed(2)
}

function formatPercent(value: number | undefined): string {
  if (value === undefined) {
    return '--'
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

function formatVolume(value: number | undefined): string {
  if (value === undefined) {
    return '--'
  }

  if (value >= 10_000) {
    return `${(value / 10_000).toFixed(1)} 万`
  }

  return `${value}`
}

function getErrorMessage(error: Error | null): string {
  return error?.message ?? '数据源返回未知错误。'
}

export default App
