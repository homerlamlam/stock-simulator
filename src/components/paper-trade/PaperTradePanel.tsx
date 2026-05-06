import { useMemo, useState } from 'react'
import type { Quote, StrategySettings } from '@/types'

interface PaperTradePanelProps {
  quote: Quote | null
  settings: StrategySettings
}

export function PaperTradePanel({ quote, settings }: PaperTradePanelProps) {
  const [buyPrice, setBuyPrice] = useState('')
  const [quantity, setQuantity] = useState('')

  const result = useMemo(() => {
    const parsedBuyPrice = Number(buyPrice)
    const parsedQuantity = Number(quantity)

    if (!quote || !Number.isFinite(parsedBuyPrice) || !Number.isFinite(parsedQuantity)) {
      return null
    }

    if (parsedBuyPrice <= 0 || parsedQuantity <= 0) {
      return null
    }

    const currentValue = quote.currentPrice * parsedQuantity
    const costValue = parsedBuyPrice * parsedQuantity
    const fee = (currentValue + costValue) * settings.feeRate
    const profit = currentValue - costValue - fee
    const profitPercent = (profit / costValue) * 100
    const status = getTradeStatus(profitPercent, settings)

    return {
      currentValue,
      fee,
      profit,
      profitPercent,
      status,
    }
  }, [buyPrice, quantity, quote, settings])

  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">买入价</span>
          <input
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
            min="0"
            onChange={(event) => setBuyPrice(event.target.value)}
            placeholder="例如 100"
            type="number"
            value={buyPrice}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">数量</span>
          <input
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
            min="0"
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="例如 100"
            type="number"
            value={quantity}
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <TradeMetric label="当前价" value={quote ? quote.currentPrice.toFixed(2) : '--'} />
        <TradeMetric label="当前市值" value={result ? result.currentValue.toFixed(2) : '--'} />
        <TradeMetric label="手续费估算" value={result ? result.fee.toFixed(2) : '--'} />
        <TradeMetric label="浮动盈亏" tone={result?.profit ?? 0} value={result ? formatProfit(result.profit) : '--'} />
      </div>

      <div className="rounded-lg bg-slate-50 px-3 py-3 text-sm">
        <span className="text-slate-500">状态：</span>
        <span className={getStatusClassName(result?.status ?? 'WAITING')}>{getStatusLabel(result?.status ?? 'WAITING')}</span>
        {result ? <span className="ml-2 text-slate-500">({result.profitPercent.toFixed(2)}%)</span> : null}
      </div>
    </div>
  )
}

type TradeStatus = 'WAITING' | 'HOLD' | 'TAKE_PROFIT' | 'STOP_LOSS'

interface TradeMetricProps {
  label: string
  value: string
  tone?: number
}

function TradeMetric({ label, value, tone }: TradeMetricProps) {
  const valueClassName =
    tone === undefined
      ? 'text-slate-950'
      : tone > 0
        ? 'text-emerald-700'
        : tone < 0
          ? 'text-red-700'
          : 'text-slate-950'

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 truncate text-sm font-semibold ${valueClassName}`}>{value}</p>
    </div>
  )
}

function getTradeStatus(profitPercent: number, settings: StrategySettings): TradeStatus {
  if (profitPercent >= settings.takeProfitPercent) {
    return 'TAKE_PROFIT'
  }

  if (profitPercent <= -settings.stopLossPercent) {
    return 'STOP_LOSS'
  }

  return 'HOLD'
}

function getStatusLabel(status: TradeStatus): string {
  if (status === 'TAKE_PROFIT') {
    return '触发止盈'
  }

  if (status === 'STOP_LOSS') {
    return '触发止损'
  }

  if (status === 'HOLD') {
    return '继续观察'
  }

  return '等待输入'
}

function getStatusClassName(status: TradeStatus): string {
  if (status === 'TAKE_PROFIT') {
    return 'font-semibold text-emerald-700'
  }

  if (status === 'STOP_LOSS') {
    return 'font-semibold text-red-700'
  }

  return 'font-semibold text-slate-800'
}

function formatProfit(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}`
}
