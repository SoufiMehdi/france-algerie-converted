/**
 * Calculate selling price in DZD from a EUR price.
 *
 * @param {number} priceEUR  - Purchase price in euros
 * @param {number} exchangeRate - EUR → DZD rate
 * @param {number} profitMargin - Margin percentage (e.g. 50 = +50 %)
 * @returns {{ priceDZD: number, sellingPriceDZD: number }}
 */
export function calculatePrices(priceEUR, exchangeRate, profitMargin) {
  const priceDZD = priceEUR * exchangeRate
  const sellingPriceDZD = priceDZD * (1 + profitMargin / 100)
  return {
    priceDZD: Math.ceil(priceDZD),
    sellingPriceDZD: Math.ceil(sellingPriceDZD),
  }
}

/**
 * Full breakdown for a single product line.
 *
 * @param {object} product - { priceEUR, quantity }
 * @param {number} exchangeRate
 * @param {number} profitMargin
 * @returns {object} enriched product data
 */
export function calculateProductBreakdown(product, exchangeRate, profitMargin) {
  const { priceDZD, sellingPriceDZD } = calculatePrices(
    product.priceEUR,
    exchangeRate,
    profitMargin,
  )
  const qty = product.quantity
  return {
    ...product,
    priceDZD,
    sellingPriceDZD,
    totalCostDZD: Math.ceil(priceDZD * qty),
    totalSellingDZD: Math.ceil(sellingPriceDZD * qty),
    profit: Math.ceil((sellingPriceDZD - priceDZD) * qty),
  }
}

/**
 * Aggregate totals for a list of products.
 *
 * @param {Array} products - products with breakdown fields
 * @returns {object}
 */
export function calculateTotals(products) {
  return products.reduce(
    (acc, p) => ({
      totalCostEUR: acc.totalCostEUR + p.priceEUR * p.quantity,
      totalCostDZD: acc.totalCostDZD + p.totalCostDZD,
      totalSellingDZD: acc.totalSellingDZD + p.totalSellingDZD,
      totalProfit: acc.totalProfit + p.profit,
      totalQty: acc.totalQty + p.quantity,
    }),
    { totalCostEUR: 0, totalCostDZD: 0, totalSellingDZD: 0, totalProfit: 0, totalQty: 0 },
  )
}

/**
 * Voyage-level stats (used on the VoyageCard).
 */
export function calculateVoyageStats(products, exchangeRate, profitMargin) {
  const breakdowns = products.map((p) =>
    calculateProductBreakdown(p, exchangeRate, profitMargin),
  )
  return {
    totalProducts: products.length,
    ...calculateTotals(breakdowns),
  }
}
