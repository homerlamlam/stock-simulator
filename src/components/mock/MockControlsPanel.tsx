import type { DataSourceErrorMode, MockFixtureMode } from '@/services'
import { getDataSourceErrorModeLabel } from '@/services'

interface MockControlsPanelProps {
  mockError: boolean
  dataSourceErrorMode: DataSourceErrorMode
  fixtureMode: MockFixtureMode
  onDataSourceErrorModeChange: (mode: DataSourceErrorMode) => void
  onMockErrorChange: (enabled: boolean) => void
  onFixtureModeChange: (mode: MockFixtureMode) => void
}

const fixtureOptions: Array<{ label: string; value: MockFixtureMode }> = [
  { label: '正常走势', value: 'normal' },
  { label: '空 candles', value: 'empty' },
  { label: '极端波动', value: 'extreme' },
  { label: '横盘', value: 'flat' },
  { label: '上涨', value: 'uptrend' },
  { label: '下跌', value: 'downtrend' },
]

const errorModeOptions: DataSourceErrorMode[] = [
  'none',
  'not_configured',
  'network_error',
  'rate_limited',
  'unauthorized',
  'delayed',
  'market_closed',
  'provider_error',
]

export function MockControlsPanel({
  dataSourceErrorMode,
  fixtureMode,
  mockError,
  onDataSourceErrorModeChange,
  onFixtureModeChange,
  onMockErrorChange,
}: MockControlsPanelProps) {
  return (
    <div className="mt-4 rounded-lg border border-orange-100 bg-orange-50/50 p-3">
      <p className="text-sm font-semibold text-slate-950">Mock 数据</p>
      <label className="mt-3 block">
        <span className="mb-1 block text-xs text-slate-500">Fixture</span>
        <select
          className="h-10 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm text-slate-900 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
          onChange={(event) => onFixtureModeChange(event.target.value as MockFixtureMode)}
          value={fixtureMode}
        >
          {fixtureOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 block">
        <span className="mb-1 block text-xs text-slate-500">数据源错误</span>
        <select
          className="h-10 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm text-slate-900 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
          onChange={(event) => onDataSourceErrorModeChange(event.target.value as DataSourceErrorMode)}
          value={dataSourceErrorMode}
        >
          {errorModeOptions.map((mode) => (
            <option key={mode} value={mode}>
              {getDataSourceErrorModeLabel(mode)}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
        <input
          checked={mockError}
          className="h-4 w-4 accent-orange-600"
          onChange={(event) => onMockErrorChange(event.target.checked)}
          type="checkbox"
        />
        模拟错误
      </label>
    </div>
  )
}
