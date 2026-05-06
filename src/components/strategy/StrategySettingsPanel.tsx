import { useState } from 'react'
import type { StrategySettings } from '@/types'

interface StrategySettingsPanelProps {
  settings: StrategySettings
  onUpdate: (settings: Partial<StrategySettings>) => void
  onReset: () => void
}

export function StrategySettingsPanel({ settings, onUpdate, onReset }: StrategySettingsPanelProps) {
  const [error, setError] = useState<string | null>(null)

  function updateNumberSetting(key: keyof StrategySettings, value: string): void {
    const numericValue = Number(value)

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setError('参数必须是大于 0 的数字。')
      return
    }

    if (key === 'shortMaPeriod' && numericValue >= settings.longMaPeriod) {
      setError('短均线周期必须小于长均线周期。')
      return
    }

    if (key === 'longMaPeriod' && numericValue <= settings.shortMaPeriod) {
      setError('长均线周期必须大于短均线周期。')
      return
    }

    if (key === 'rsiOverbought' && numericValue <= settings.rsiOversold) {
      setError('RSI 超买阈值必须大于超卖阈值。')
      return
    }

    if (key === 'rsiOversold' && numericValue >= settings.rsiOverbought) {
      setError('RSI 超卖阈值必须小于超买阈值。')
      return
    }

    setError(null)
    onUpdate({ [key]: numericValue })
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField
          label="短均线"
          onChange={(value) => updateNumberSetting('shortMaPeriod', value)}
          value={settings.shortMaPeriod}
        />
        <NumberField
          label="长均线"
          onChange={(value) => updateNumberSetting('longMaPeriod', value)}
          value={settings.longMaPeriod}
        />
        <NumberField
          label="RSI 周期"
          onChange={(value) => updateNumberSetting('rsiPeriod', value)}
          value={settings.rsiPeriod}
        />
        <NumberField
          label="RSI 超买"
          onChange={(value) => updateNumberSetting('rsiOverbought', value)}
          value={settings.rsiOverbought}
        />
        <NumberField
          label="RSI 超卖"
          onChange={(value) => updateNumberSetting('rsiOversold', value)}
          value={settings.rsiOversold}
        />
        <NumberField
          label="止盈 %"
          onChange={(value) => updateNumberSetting('takeProfitPercent', value)}
          value={settings.takeProfitPercent}
        />
        <NumberField
          label="止损 %"
          onChange={(value) => updateNumberSetting('stopLossPercent', value)}
          value={settings.stopLossPercent}
        />
        <NumberField
          label="最小置信度"
          onChange={(value) => updateNumberSetting('minimumConfidence', value)}
          value={settings.minimumConfidence}
        />
      </div>

      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <button
        className="w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-800 transition hover:bg-orange-100"
        onClick={() => {
          setError(null)
          onReset()
        }}
        type="button"
      >
        恢复默认
      </button>
    </div>
  )
}

interface NumberFieldProps {
  label: string
  value: number
  onChange: (value: string) => void
}

function NumberField({ label, value, onChange }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <input
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
        min="0"
        onChange={(event) => onChange(event.target.value)}
        type="number"
        value={value}
      />
    </label>
  )
}
