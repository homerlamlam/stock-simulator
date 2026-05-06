import type { TradeSignal } from '@/types'

interface SignalCardProps {
  signal: TradeSignal | null
}

const signalLabels: Record<TradeSignal['type'], string> = {
  WATCH: '观察',
  BUY_DIP: '偏低吸',
  TAKE_PROFIT: '偏止盈',
  STOP_LOSS: '偏止损',
  HIGH_RISK: '风险过高',
}

const riskLabels: Record<TradeSignal['riskLevel'], string> = {
  LOW: '低风险',
  MEDIUM: '中风险',
  HIGH: '高风险',
}

export function SignalCard({ signal }: SignalCardProps) {
  if (!signal) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-orange-200 bg-orange-50/50 p-4 text-sm text-slate-500">
        暂无可用信号
      </div>
    )
  }

  return (
    <div className="mt-4 rounded-lg border border-orange-100 bg-orange-50/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-orange-700">当前信号</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-950">{signalLabels[signal.type]}</h3>
        </div>
        <span className={getRiskClassName(signal.riskLevel)}>{riskLabels[signal.riskLevel]}</span>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">置信度</span>
          <span className="font-semibold text-slate-950">{signal.confidence}%</span>
        </div>
        <div className="h-2 rounded-full bg-white">
          <div
            className="h-2 rounded-full bg-orange-500"
            style={{ width: `${Math.max(0, Math.min(100, signal.confidence))}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <SignalMetric label="建议区间" value={formatRange(signal)} />
        <SignalMetric label="更新时间" value={signal.updatedAt.slice(11, 19)} />
        <SignalMetric label="RSI" value={formatNullable(signal.indicators.rsi)} />
        <SignalMetric label="波动率" value={formatNullable(signal.indicators.volatility, '%')} />
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-950">原因</p>
        <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
          {signal.reasons.map((reason) => (
            <li className="rounded-lg bg-white px-3 py-2" key={reason}>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

interface SignalMetricProps {
  label: string
  value: string
}

function SignalMetric({ label, value }: SignalMetricProps) {
  return (
    <div className="rounded-lg bg-white px-3 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function getRiskClassName(riskLevel: TradeSignal['riskLevel']): string {
  const baseClassName = 'w-fit rounded-full px-3 py-1 text-sm font-semibold'

  if (riskLevel === 'HIGH') {
    return `${baseClassName} bg-red-50 text-red-700`
  }

  if (riskLevel === 'MEDIUM') {
    return `${baseClassName} bg-amber-50 text-amber-700`
  }

  return `${baseClassName} bg-emerald-50 text-emerald-700`
}

function formatRange(signal: TradeSignal): string {
  if (!signal.suggestedPriceRange) {
    return '--'
  }

  return `${signal.suggestedPriceRange.low.toFixed(2)} - ${signal.suggestedPriceRange.high.toFixed(2)}`
}

function formatNullable(value: number | null, suffix = ''): string {
  return value === null ? '--' : `${value.toFixed(2)}${suffix}`
}
