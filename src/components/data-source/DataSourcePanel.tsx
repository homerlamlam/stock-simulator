import type { DataSourceMode, DataSourceStatus } from '@/types'

interface DataSourcePanelProps {
  mode: DataSourceMode
  status: DataSourceStatus
  onModeChange: (mode: DataSourceMode) => void
}

const options: Array<{ value: DataSourceMode; label: string; description: string }> = [
  { value: 'mock', label: 'Mock', description: '本地模拟行情' },
  { value: 'real', label: 'Real API', description: '仅真实数据' },
  { value: 'hybrid', label: 'Hybrid', description: '真实优先，失败回退' },
]

export function DataSourcePanel({ mode, onModeChange, status }: DataSourcePanelProps) {
  return (
    <section className="mt-4 rounded-lg border border-orange-100 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">数据源</p>
          <p className="mt-1 text-xs text-slate-500">{status.message}</p>
        </div>
        <span className={getStatusClassName(status.code)}>{status.label}</span>
      </div>

      <div className="mt-3 grid gap-2">
        {options.map((option) => (
          <button
            className={[
              'rounded-lg border px-3 py-2 text-left text-sm transition',
              mode === option.value
                ? 'border-orange-300 bg-orange-50 text-orange-950'
                : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-orange-200',
            ].join(' ')}
            key={option.value}
            onClick={() => onModeChange(option.value)}
            type="button"
          >
            <span className="block font-medium">{option.label}</span>
            <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function getStatusClassName(code: DataSourceStatus['code']): string {
  const base = 'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium'

  if (code === 'not_configured') {
    return `${base} bg-amber-50 text-amber-700`
  }

  if (code === 'real_ready' || code === 'hybrid') {
    return `${base} bg-emerald-50 text-emerald-700`
  }

  return `${base} bg-orange-50 text-orange-700`
}
