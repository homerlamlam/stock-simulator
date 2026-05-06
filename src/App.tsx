import { DEFAULT_STRATEGY_SETTINGS } from '@/config'
import { PriceChart } from '@/components/charts'
import { SignalCard } from '@/components/signals'
import { useSignal } from '@/hooks'
import { useStrategyStore, useWatchlistStore } from '@/store'

function App() {
  const watchlist = useWatchlistStore((state) => state.watchlist)
  const selectedSymbol = useWatchlistStore((state) => state.selectedSymbol)
  const selectStock = useWatchlistStore((state) => state.selectStock)
  const settings = useStrategyStore((state) => state.settings)
  const snapshot = useSignal(selectedSymbol)
  const quote = snapshot.quote

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
          <aside className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-950">自选股</h2>
              <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
                {watchlist.length} 只
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
              {watchlist.map((stock) => {
                const isSelected = stock.displayCode === selectedSymbol

                return (
                  <button
                    className={`min-w-44 rounded-lg border px-3 py-3 text-left transition lg:min-w-0 ${
                      isSelected
                        ? 'border-orange-300 bg-orange-50 text-orange-950'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/60'
                    }`}
                    key={stock.displayCode}
                    onClick={() => selectStock(stock.displayCode)}
                    type="button"
                  >
                    <span className="block text-sm font-semibold">{stock.displayCode}</span>
                    <span className="block truncate text-xs text-slate-500">{stock.name}</span>
                  </button>
                )
              })}
            </div>
          </aside>

          <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <div className="grid min-w-0 gap-4">
              <section className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">当前标的</p>
                    <h2 className="text-xl font-semibold text-slate-950">{selectedSymbol ?? '未选择股票'}</h2>
                  </div>
                  <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    {snapshot.isLoading ? '加载中' : '数据已连接'}
                  </span>
                </div>

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
                  <PriceChart candles={snapshot.candles} settings={settings} />
                </div>
              </section>
            </div>

            <div className="grid gap-4">
              <section className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
                <SectionHeader title="信号推荐" note="辅助分析结果" />
                <SignalCard signal={snapshot.signal} />
              </section>

              <section className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
                <SectionHeader title="策略参数" note="完整控件将在后续实现" />
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Metric label="短均线" value={`${settings.shortMaPeriod}`} />
                  <Metric label="长均线" value={`${settings.longMaPeriod}`} />
                  <Metric label="RSI 超买" value={`${settings.rsiOverbought}`} />
                  <Metric label="止损" value={`${settings.stopLossPercent}%`} />
                </div>
              </section>

              <section className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
                <SectionHeader title="模拟交易" note="表单将在后续实现" />
                <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                  默认手续费估算：{(DEFAULT_STRATEGY_SETTINGS.feeRate * 100).toFixed(2)}%
                </div>
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

export default App
