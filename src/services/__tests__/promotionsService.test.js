import { describe, it, expect } from 'vitest'
import {
  fetchPromotions,
  fetchBestDeals,
  fetchSuggestions,
  fetchAllPromotions,
} from '../promotionsService'

describe('promotionsService', () => {
  describe('fetchPromotions', () => {
    it('returns all nearby promotions when no filters', async () => {
      const promos = await fetchPromotions()
      expect(promos.length).toBeGreaterThan(0)
      // All promos should be from nearby stores
      const storeIds = new Set(promos.map((p) => p.storeId))
      expect(storeIds.size).toBeGreaterThan(0)
    })

    it('filters by store IDs', async () => {
      const promos = await fetchPromotions(['auchan'])
      promos.forEach((p) => {
        expect(p.storeId).toBe('auchan')
      })
    })

    it('filters by category', async () => {
      const promos = await fetchPromotions(null, 'frais')
      promos.forEach((p) => {
        expect(p.category).toBe('frais')
      })
    })

    it('filters by both store and category', async () => {
      const promos = await fetchPromotions(['auchan'], 'frais')
      promos.forEach((p) => {
        expect(p.storeId).toBe('auchan')
        expect(p.category).toBe('frais')
      })
    })
  })

  describe('fetchAllPromotions', () => {
    it('returns all promos', async () => {
      const promos = await fetchAllPromotions()
      expect(Array.isArray(promos)).toBe(true)
      expect(promos.length).toBeGreaterThan(0)
    })
  })

  describe('fetchBestDeals', () => {
    it('returns sorted by discount descending', async () => {
      const deals = await fetchBestDeals(5)
      expect(deals.length).toBeLessThanOrEqual(5)
      for (let i = 1; i < deals.length; i++) {
        expect(deals[i - 1].discount).toBeGreaterThanOrEqual(deals[i].discount)
      }
    })

    it('each deal has discount property', async () => {
      const deals = await fetchBestDeals(3)
      deals.forEach((d) => {
        expect(typeof d.discount).toBe('number')
        expect(d.discount).toBeGreaterThan(0)
      })
    })
  })

  describe('fetchSuggestions', () => {
    it('returns only items with >= 30% discount', async () => {
      const suggestions = await fetchSuggestions()
      suggestions.forEach((s) => {
        expect(s.discount).toBeGreaterThanOrEqual(30)
      })
    })

    it('returns sorted by discount descending', async () => {
      const suggestions = await fetchSuggestions()
      for (let i = 1; i < suggestions.length; i++) {
        expect(suggestions[i - 1].discount).toBeGreaterThanOrEqual(suggestions[i].discount)
      }
    })

    it('includes savings property', async () => {
      const suggestions = await fetchSuggestions()
      suggestions.forEach((s) => {
        expect(typeof s.savings).toBe('number')
        expect(s.savings).toBeGreaterThan(0)
      })
    })
  })
})
