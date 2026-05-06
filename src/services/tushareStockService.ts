import type { Exchange, StockProfile, StockSymbol } from '@/types'
import { createDataSourceError } from './dataSourceErrors'
import { searchLocalStockCatalog } from './stockCatalog'

interface TushareResponse {
  code: number
  msg: string
  data?: {
    fields: string[]
    items: unknown[][]
  }
}

const CACHE_KEY = 'stock-signal-tushare-stock-basic'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

let memoryCache: StockProfile[] | null = null

export async function searchTushareStocks(keyword: string): Promise<StockSymbol[]> {
  const profiles = await getTushareStockProfiles()
  const normalizedKeyword = keyword.trim().toUpperCase()

  const matchedProfiles = normalizedKeyword
    ? profiles.filter(
        (profile) =>
          profile.symbol.includes(normalizedKeyword) ||
          profile.code.includes(normalizedKeyword) ||
          profile.displayCode.includes(normalizedKeyword) ||
          profile.name.toUpperCase().includes(normalizedKeyword) ||
          (profile.industry?.toUpperCase().includes(normalizedKeyword) ?? false) ||
          (profile.area?.toUpperCase().includes(normalizedKeyword) ?? false),
      )
    : profiles

  return matchedProfiles.slice(0, 30).map(profileToStockSymbol)
}

export async function getTushareStockProfile(symbol: string): Promise<StockProfile | null> {
  const profiles = await getTushareStockProfiles()
  return profiles.find((profile) => profile.symbol === symbol) ?? null
}

export function mapTushareStockBasicResponse(response: TushareResponse): StockProfile[] {
  if (response.code !== 0 || !response.data) {
    throw createDataSourceError(response.code === -2001 ? 'unauthorized' : 'provider_error')
  }

  const fields = response.data.fields

  return response.data.items.map((item) => mapTushareStockBasicRow(fields, item)).filter((item) => item !== null)
}

async function getTushareStockProfiles(): Promise<StockProfile[]> {
  if (memoryCache) {
    return memoryCache
  }

  const cachedProfiles = readCachedProfiles()

  if (cachedProfiles) {
    memoryCache = cachedProfiles
    return cachedProfiles
  }

  const response = await requestTushareStockBasic()
  const profiles = mapTushareStockBasicResponse(response)
  memoryCache = profiles
  writeCachedProfiles(profiles)
  return profiles
}

async function requestTushareStockBasic(): Promise<TushareResponse> {
  const response = await fetch('/api/tushare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_name: 'stock_basic',
      params: {
        list_status: 'L',
      },
      fields: 'ts_code,symbol,name,area,industry,market,exchange,list_date,list_status',
    }),
  })

  if (response.status === 503) {
    throw createDataSourceError('not_configured')
  }

  if (!response.ok) {
    throw createDataSourceError('provider_error')
  }

  return response.json()
}

function mapTushareStockBasicRow(fields: string[], item: unknown[]): StockProfile | null {
  const row = Object.fromEntries(fields.map((field, index) => [field, item[index]]))
  const tsCode = readString(row.ts_code)
  const code = readString(row.symbol)
  const name = readString(row.name)
  const exchange = normalizeExchange(readString(row.exchange) || getExchangeFromTsCode(tsCode))

  if (!tsCode || !code || !name || !exchange) {
    return null
  }

  return {
    symbol: tsCode,
    code,
    exchange,
    market: 'CN',
    displayCode: code,
    name,
    area: readNullableString(row.area),
    industry: readNullableString(row.industry),
    board: readNullableString(row.market),
    listDate: formatListDate(readNullableString(row.list_date)),
    listStatus: readNullableString(row.list_status),
    dataSource: 'tushare',
  }
}

function profileToStockSymbol(profile: StockProfile): StockSymbol {
  return {
    symbol: profile.symbol,
    code: profile.code,
    exchange: profile.exchange,
    market: profile.market,
    displayCode: profile.displayCode,
    name: profile.name,
    profile,
  }
}

function readCachedProfiles(): StockProfile[] | null {
  if (typeof localStorage === 'undefined') {
    return null
  }

  try {
    const rawValue = localStorage.getItem(CACHE_KEY)

    if (!rawValue) {
      return null
    }

    const parsed = JSON.parse(rawValue) as { savedAt?: number; profiles?: StockProfile[] }

    if (!parsed.savedAt || !Array.isArray(parsed.profiles) || Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      return null
    }

    return parsed.profiles
  } catch {
    return null
  }
}

function writeCachedProfiles(profiles: StockProfile[]): void {
  if (typeof localStorage === 'undefined') {
    return
  }

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        profiles,
      }),
    )
  } catch {
    // Cache failures should not block search.
  }
}

function normalizeExchange(value: string): Exchange | null {
  if (value === 'SSE' || value === 'SH') {
    return 'SH'
  }

  if (value === 'SZSE' || value === 'SZ') {
    return 'SZ'
  }

  if (value === 'BSE' || value === 'BJ') {
    return 'BJ'
  }

  return null
}

function getExchangeFromTsCode(tsCode: string): string {
  return tsCode.split('.')[1] ?? ''
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function readNullableString(value: unknown): string | null {
  const stringValue = readString(value)
  return stringValue ? stringValue : null
}

function formatListDate(value: string | null): string | null {
  if (!value || value.length !== 8) {
    return value
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
}

export function getLocalStockProfile(symbol: string): StockProfile | null {
  const stock = searchLocalStockCatalog('', 'CN').find((item) => item.symbol === symbol)

  if (!stock) {
    return null
  }

  return {
    symbol: stock.symbol,
    code: stock.code,
    exchange: stock.exchange,
    market: stock.market,
    displayCode: stock.displayCode,
    name: stock.name,
    area: null,
    industry: null,
    board: null,
    listDate: null,
    listStatus: null,
    dataSource: 'local',
  }
}
