import type { MockFixtureMode } from '@/services/mockMarketDataService'
import { mockMarketDataService } from '@/services/mockMarketDataService'
import type { MarketDataService } from '@/types'

interface ControllableMarketDataService extends MarketDataService {
  setMockError?: (enabled: boolean) => void
  setFixtureMode?: (mode: MockFixtureMode) => void
}

let activeMarketDataService: ControllableMarketDataService = mockMarketDataService

export function getMarketDataService(): MarketDataService {
  return activeMarketDataService
}

export function setMarketDataService(service: ControllableMarketDataService): void {
  activeMarketDataService = service
}

export function applyMarketDataControls(mockError: boolean, fixtureMode: MockFixtureMode): void {
  activeMarketDataService.setMockError?.(mockError)
  activeMarketDataService.setFixtureMode?.(fixtureMode)
}
