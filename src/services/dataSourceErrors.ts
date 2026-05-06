import type { DataSourceErrorCode } from '@/types'

export type DataSourceErrorMode = DataSourceErrorCode | 'none'

interface DataSourceErrorCopy {
  title: string
  message: string
}

const errorCopy: Record<DataSourceErrorCode, DataSourceErrorCopy> = {
  not_configured: {
    title: '数据源未配置',
    message: '真实 API 尚未配置，请切换回 Mock 或补充环境变量后重试。',
  },
  network_error: {
    title: '网络错误',
    message: '行情服务暂时无法连接，请稍后重试或切换回 Mock。',
  },
  rate_limited: {
    title: '请求过于频繁',
    message: '真实行情接口触发限流，请降低刷新频率后重试。',
  },
  unauthorized: {
    title: '数据权限不足',
    message: '当前 API key 无效或没有该市场权限，请检查配置。',
  },
  delayed: {
    title: '延迟行情',
    message: '当前数据可能不是实时行情，信号只适合作为观察参考。',
  },
  market_closed: {
    title: '市场休市',
    message: '当前市场不在交易时段，行情和信号可能不会继续更新。',
  },
  provider_error: {
    title: '供应商错误',
    message: '行情供应商返回异常，请稍后重试或切换回 Mock。',
  },
}

export class DataSourceError extends Error {
  readonly code: DataSourceErrorCode
  readonly userTitle: string
  readonly userMessage: string

  constructor(code: DataSourceErrorCode, debugMessage?: string) {
    const copy = errorCopy[code]
    super(debugMessage ?? copy.message)
    this.name = 'DataSourceError'
    this.code = code
    this.userTitle = copy.title
    this.userMessage = copy.message
  }
}

export function createDataSourceError(code: DataSourceErrorCode): DataSourceError {
  return new DataSourceError(code)
}

export function getDataSourceErrorCopy(error: Error | null): DataSourceErrorCopy {
  if (error instanceof DataSourceError) {
    return {
      title: error.userTitle,
      message: error.userMessage,
    }
  }

  return {
    title: '行情数据错误',
    message: error?.message ?? '数据源返回未知错误。',
  }
}

export function getDataSourceErrorModeLabel(mode: DataSourceErrorMode): string {
  if (mode === 'none') {
    return '无'
  }

  return errorCopy[mode].title
}
