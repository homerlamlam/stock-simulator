import { useMemo } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Candle, StrategySettings } from '@/types'
import { calculateMovingAverage } from '@/utils'

interface PriceChartProps {
  candles: Candle[]
  settings: StrategySettings
}

interface ChartPoint {
  time: string
  close: number
  shortMa: number | null
  longMa: number | null
  volume: number
}

export function PriceChart({ candles, settings }: PriceChartProps) {
  const chartData = useMemo<ChartPoint[]>(() => {
    const closes = candles.map((candle) => candle.close)
    const shortMaValues = calculateMovingAverage(closes, settings.shortMaPeriod)
    const longMaValues = calculateMovingAverage(closes, settings.longMaPeriod)

    return candles.map((candle, index) => ({
      time: candle.timestamp.slice(11, 16),
      close: candle.close,
      shortMa: shortMaValues[index],
      longMa: longMaValues[index],
      volume: candle.volume,
    }))
  }, [candles, settings.longMaPeriod, settings.shortMaPeriod])

  if (chartData.length === 0) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-orange-200 bg-orange-50/50 text-sm text-slate-500">
        暂无走势数据
      </div>
    )
  }

  return (
    <div className="h-80 min-h-80 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <ComposedChart data={chartData} margin={{ bottom: 8, left: 0, right: 8, top: 8 }}>
          <CartesianGrid stroke="#f3e8d7" strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={24} stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis
            domain={['dataMin - 1', 'dataMax + 1']}
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            width={48}
            yAxisId="price"
          />
          <YAxis hide orientation="right" yAxisId="volume" />
          <Tooltip
            contentStyle={{
              border: '1px solid #fed7aa',
              borderRadius: 8,
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="volume" fill="#fed7aa" name="成交量" opacity={0.5} yAxisId="volume" />
          <Line
            dataKey="close"
            dot={false}
            name="当前价"
            stroke="#0f172a"
            strokeWidth={2}
            type="monotone"
            yAxisId="price"
          />
          <Line
            dataKey="shortMa"
            dot={false}
            name={`MA${settings.shortMaPeriod}`}
            stroke="#16a34a"
            strokeWidth={1.8}
            type="monotone"
            yAxisId="price"
          />
          <Line
            dataKey="longMa"
            dot={false}
            name={`MA${settings.longMaPeriod}`}
            stroke="#f97316"
            strokeWidth={1.8}
            type="monotone"
            yAxisId="price"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
