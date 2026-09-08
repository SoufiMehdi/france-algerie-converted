import { describe, it, expect } from 'vitest'
import { STORES, getNearbyStores, BEAUMONT_COORDS, SEARCH_RADIUS_KM } from '../stores'

describe('stores constants', () => {
  describe('STORES', () => {
    it('contains all expected stores', () => {
      const storeIds = STORES.map((s) => s.id)
      expect(storeIds).toContain('auchan')
      expect(storeIds).toContain('aldi')
      expect(storeIds).toContain('leclerc')
      expect(storeIds).toContain('yvrochet')
      expect(storeIds).toContain('action')
      expect(storeIds).toContain('lidl')
    })

    it('each store has required fields', () => {
      STORES.forEach((store) => {
        expect(store.id).toBeDefined()
        expect(store.name).toBeDefined()
        expect(store.color).toBeDefined()
        expect(typeof store.lat).toBe('number')
        expect(typeof store.lng).toBe('number')
        expect(store.address).toBeDefined()
      })
    })
  })

  describe('getNearbyStores', () => {
    it('returns stores within 10km of Beaumont', () => {
      const nearby = getNearbyStores()
      expect(nearby.length).toBeGreaterThan(0)
      nearby.forEach((store) => {
        const dlat = Math.abs(store.lat - BEAUMONT_COORDS.lat)
        const dlng = Math.abs(store.lng - BEAUMONT_COORDS.lng)
        expect(dlat).toBeLessThanOrEqual(10 / 111)
        expect(dlng).toBeLessThanOrEqual(10 / 78)
      })
    })

    it('all defined stores are nearby', () => {
      const nearby = getNearbyStores()
      expect(nearby.length).toBe(STORES.length)
    })
  })


  describe('constants', () => {
    it('BEAUMONT_COORDS has lat and lng', () => {
      expect(typeof BEAUMONT_COORDS.lat).toBe('number')
      expect(typeof BEAUMONT_COORDS.lng).toBe('number')
    })

    it('SEARCH_RADIUS_KM is 10', () => {
      expect(SEARCH_RADIUS_KM).toBe(10)
    })
  })
})
