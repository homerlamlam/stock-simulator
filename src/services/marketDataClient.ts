import type { MockFixtureMode } from '@/services/mockMarketDataService'
import { mockMarketDataService } from '@/services/mockMarketDataService'
import { StooqMarketDataService } from '@/services/stooqMarketDataService'
import type { DataSourceMode, MarketDataService } from '@/types'

interface ControllableMarketDataService extends MarketDataService {
  setMockError?: (enabled: boolean) => void
  setFixtureMode?: (mode: MockFixtureMode) => void
}

let activeMarketDataService: ControllableMarketDataService = mockMarketDataService
const stooqMarketDataService = new StooqMarketDataService({
  fallbackCandlesService: mockMarketDataService,
})
const hybridMarketDataService: MarketDataService = {
  async getQuote(symbol) {
    try {
      return await stooqMarketDataService.getQuote(symbol)
    } catch {
      return mockMarketDataService.getQuote(symbol)
    }
  },
  getCandles(symbol, range) {
    return mockMarketDataService.getCandles(symbol, range)
  },
  searchStocks(keyword, options) {
    return mockMarketDataService.searchStocks(keyword, options)
  },
}

export function getMarketDataService(mode: DataSourceMode = 'mock'): MarketDataService {
  if (mode === 'real') {
    return stooqMarketDataService
  }

  if (mode === 'hybrid') {
    return hybridMarketDataService
  }

  return activeMarketDataService
}

export function setMarketDataService(service: ControllableMarketDataService): void {
  activeMarketDataService = service
}

export function applyMarketDataControls(mockError: boolean, fixtureMode: MockFixtureMode): void {
  activeMarketDataService.setMockError?.(mockError)
  activeMarketDataService.setFixtureMode?.(fixtureMode)
  mockMarketDataService.setMockError(mockError)
  mockMarketDataService.setFixtureMode(fixtureMode)
}
