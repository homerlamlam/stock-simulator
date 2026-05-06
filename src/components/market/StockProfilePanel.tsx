import type { StockProfile } from '@/types'

interface StockProfilePanelProps {
  isLoading: boolean
  profile: StockProfile | null | undefined
}

export function StockProfilePanel({ isLoading, profile }: StockProfilePanelProps) {
  if (isLoading) {
    return <p className="mt-3 text-sm text-slate-500">正在加载股票基础信息...</p>
  }

  if (!profile) {
    return <p className="mt-3 text-sm text-slate-500">暂无股票基础信息。</p>
  }

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <ProfileMetric label="行业" value={profile.industry ?? '--'} />
      <ProfileMetric label="地区" value={profile.area ?? '--'} />
      <ProfileMetric label="板块" value={profile.board ?? '--'} />
      <ProfileMetric label="上市日期" value={profile.listDate ?? '--'} />
      <ProfileMetric label="交易所" value={profile.exchange} />
      <ProfileMetric label="上市状态" value={profile.listStatus ?? '--'} />
      <ProfileMetric label="数据源" value={profile.dataSource === 'tushare' ? 'Tushare' : '本地缓存'} />
    </div>
  )
}

interface ProfileMetricProps {
  label: string
  value: string
}

function ProfileMetric({ label, value }: ProfileMetricProps) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</p>
    </div>
  )
}
