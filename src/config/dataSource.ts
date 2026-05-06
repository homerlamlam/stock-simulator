export const STOOQ_PROXY_BASE_URL = '/api/stooq'

export function isRealDataSourceConfigured(): boolean {
  return import.meta.env.VITE_STOOQ_REAL_ENABLED === 'true'
}
