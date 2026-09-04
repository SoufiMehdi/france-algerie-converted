import { describe, it, expect } from 'vitest'
import {
  calculatePrices,
  calculateProductBreakdown,
  calculateTotals,
  calculateVoyageStats,
} from '../priceCalculator'

describe('calculatePrices', () => {
  it('converts EUR to DZD with margin', () => {
    const result = calculatePrices(100, 154.5, 50)
    // 100 * 154.5 = 15450, * 1.5 = 23175
    expect(result.priceDZD).toBe(15450)
    expect(result.sellingPriceDZD).toBe(23175)
  })

  it('rounds up using Math.ceil', () => {
    const result = calculatePrices(10.5, 154.5, 50)
    // 10.5 * 154.5 = 1622.25, ceil = 1623
    expect(result.priceDZD).toBe(1623)
  })

  it('handles 0% margin', () => {
    const result = calculatePrices(100, 154.5, 0)
    expect(result.sellingPriceDZD).toBe(15450)
  })

  it('handles 100% margin (double)', () => {
    const result = calculatePrices(100, 154.5, 100)
    expect(result.sellingPriceDZD).toBe(30900)
  })
})

describe('calculateProductBreakdown', () => {
  it('calculates full breakdown for a product', () => {
    const result = calculateProductBreakdown(
      { priceEUR: 50, quantity: 2 },
      154.5,
      50,
    )
    // priceDZD = 50 * 154.5 = 7725
    // sellingPriceDZD = 7725 * 1.5 = 11587.5, ceil = 11588
    expect(result.priceDZD).toBe(7725)
    expect(result.sellingPriceDZD).toBe(11588)
    expect(result.totalCostDZD).toBe(15450)
    expect(result.totalSellingDZD).toBe(23176)
    expect(result.profit).toBe(7726)
  })

  it('preserves original product fields', () => {
    const result = calculateProductBreakdown(
      { id: 1, name: 'Test', priceEUR: 10, quantity: 1 },
      154.5,
      50,
    )
    expect(result.id).toBe(1)
    expect(result.name).toBe('Test')
  })
})

describe('calculateTotals', () => {
  it('sums multiple products', () => {
    const products = [
      calculateProductBreakdown({ priceEUR: 10, quantity: 1 }, 154.5, 50),
      calculateProductBreakdown({ priceEUR: 20, quantity: 2 }, 154.5, 50),
    ]
    const totals = calculateTotals(products)
    expect(totals.totalQty).toBe(3)
    expect(totals.totalProfit).toBeGreaterThan(0)
    expect(totals.totalCostEUR).toBe(50)
  })

  it('returns zeros for empty array', () => {
    const totals = calculateTotals([])
    expect(totals.totalQty).toBe(0)
    expect(totals.totalProfit).toBe(0)
  })
})

describe('calculateVoyageStats', () => {
  it('returns totalProducts count', () => {
    const products = [
      { priceEUR: 10, quantity: 1 },
      { priceEUR: 20, quantity: 1 },
      { priceEUR: 30, quantity: 1 },
    ]
    const stats = calculateVoyageStats(products, 154.5, 50)
    expect(stats.totalProducts).toBe(3)
    expect(stats.totalQty).toBe(3)
  })
})
