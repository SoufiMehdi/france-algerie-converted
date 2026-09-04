/**
 * Promotions service — fetches promo data for nearby stores.
 *
 * Current implementation uses mock data representative of real weekly promotions.
 * Replace `fetchMockPromotions` with real HTTP calls when an aggregator API is available.
 */

import { getNearbyStores } from '../constants/stores'

// ── Mock promotions (representative of real weekly deals) ──────
const MOCK_PROMOTIONS = [
  // Auchan
  {
    id: 'auchan-1',
    storeId: 'auchan',
    title: 'Pack 6 eaux minérales 1,5L',
    category: 'boissons',
    originalPrice: 3.99,
    promoPrice: 1.99,
    unit: 'pack',
    validFrom: '2026-09-01',
    validUntil: '2026-09-07',
    image: null,
    description: 'Eau minérale plate - Marque repère',
  },
  {
    id: 'auchan-2',
    storeId: 'auchan',
    title: 'Poulet entier fermier',
    category: 'frais',
    originalPrice: 8.49,
    promoPrice: 4.99,
    unit: 'pièce',
    validFrom: '2026-09-01',
    validUntil: '2026-09-07',
    image: null,
    description: 'Poulet français label rouge',
  },
  {
    id: 'auchan-3',
    storeId: 'auchan',
    title: 'Lessive liquide 3L',
    category: 'menager',
    originalPrice: 9.99,
    promoPrice: 5.49,
    unit: 'flacon',
    validFrom: '2026-09-01',
    validUntil: '2026-09-07',
    image: null,
    description: 'Auchan - 40 lavages',
  },

  // Aldi
  {
    id: 'aldi-1',
    storeId: 'aldi',
    title: 'Beurre doux 250g',
    category: 'frais',
    originalPrice: 2.29,
    promoPrice: 1.39,
    unit: 'barquette',
    validFrom: '2026-09-02',
    validUntil: '2026-09-08',
    image: null,
    description: 'Beurre AOP Charentes-Poitou',
  },
  {
    id: 'aldi-2',
    storeId: 'aldi',
    title: 'Yaourts nature x12',
    category: 'frais',
    originalPrice: 3.19,
    promoPrice: 1.99,
    unit: 'lot',
    validFrom: '2026-09-02',
    validUntil: '2026-09-08',
    image: null,
    description: 'Yaourts à boire - 12 x 100g',
  },
  {
    id: 'aldi-3',
    storeId: 'aldi',
    title: 'Gants de ménage x3',
    category: 'menager',
    originalPrice: 1.99,
    promoPrice: 0.99,
    unit: 'lot',
    validFrom: '2026-09-02',
    validUntil: '2026-09-08',
    image: null,
    description: 'Gants Multi-usages',
  },

  // Leclerc
  {
    id: 'leclerc-1',
    storeId: 'leclerc',
    title: 'Huile de tournesol 1L',
    category: 'alimentation',
    originalPrice: 2.49,
    promoPrice: 1.69,
    unit: 'bouteille',
    validFrom: '2026-09-01',
    validUntil: '2026-09-07',
    image: null,
    description: 'Raffinée - Marque repère',
  },
  {
    id: 'leclerc-2',
    storeId: 'leclerc',
    title: 'Shampooing 400ml',
    category: 'hygiene',
    originalPrice: 4.59,
    promoPrice: 2.49,
    unit: 'flacon',
    validFrom: '2026-09-01',
    validUntil: '2026-09-07',
    image: null,
    description: 'Pantene Pro-V soin profond',
  },
  {
    id: 'leclerc-3',
    storeId: 'leclerc',
    title: 'Couches bébé taille 4 (x24)',
    category: 'bebe',
    originalPrice: 11.99,
    promoPrice: 7.99,
    unit: 'lot',
    validFrom: '2026-09-01',
    validUntil: '2026-09-07',
    image: null,
    description: 'Lady & Pep - Confort 12h',
  },

  // Yvroché
  {
    id: 'yvrochet-1',
    storeId: 'yvrochet',
    title: 'Filets de poulet 500g',
    category: 'frais',
    originalPrice: 6.99,
    promoPrice: 4.49,
    unit: 'barquette',
    validFrom: '2026-09-03',
    validUntil: '2026-09-07',
    image: null,
    description: 'Poulet français - Sans hormones',
  },
  {
    id: 'yvrochet-2',
    storeId: 'yvrochet',
    title: 'Croquettes chien 2kg',
    category: 'animalerie',
    originalPrice: 7.99,
    promoPrice: 4.99,
    unit: 'sachet',
    validFrom: '2026-09-03',
    validUntil: '2026-09-07',
    image: null,
    description: 'Yummix Adulte poulet & riz',
  },

  // Action
  {
    id: 'action-1',
    storeId: 'action',
    title: 'Éponges magiques x6',
    category: 'menager',
    originalPrice: 1.89,
    promoPrice: 0.79,
    unit: 'lot',
    validFrom: '2026-09-01',
    validUntil: '2026-09-14',
    image: null,
    description: 'Éponges à récurer multicolores',
  },
  {
    id: 'action-2',
    storeId: 'action',
    title: 'Bougies parfumées x3',
    category: 'divers',
    originalPrice: 2.49,
    promoPrice: 1.29,
    unit: 'lot',
    validFrom: '2026-09-01',
    validUntil: '2026-09-14',
    image: null,
    description: 'Bougies tealight vanille & cannelle',
  },
  {
    id: 'action-3',
    storeId: 'action',
    title: 'Bavoirs bébé x5',
    category: 'bebe',
    originalPrice: 2.99,
    promoPrice: 1.49,
    unit: 'lot',
    validFrom: '2026-09-01',
    validUntil: '2026-09-14',
    image: null,
    description: 'Bavoirs en tissu motifs variés',
  },

  // Lidl
  {
    id: 'lidl-1',
    storeId: 'lidl',
    title: 'Fromage blanc 500g',
    category: 'frais',
    originalPrice: 1.69,
    promoPrice: 0.89,
    unit: 'pot',
    validFrom: '2026-09-03',
    validUntil: '2026-09-08',
    image: null,
    description: 'Milbona Nature 0% MG',
  },
  {
    id: 'lidl-2',
    storeId: 'lidl',
    title: 'Café moulu 250g',
    category: 'alimentation',
    originalPrice: 3.99,
    promoPrice: 2.49,
    unit: 'boîte',
    validFrom: '2026-09-03',
    validUntil: '2026-09-08',
    image: null,
    description: 'Bellarom Espresso italien',
  },
  {
    id: 'lidl-3',
    storeId: 'lidl',
    title: 'Couche pratique 90x60cm',
    category: 'menager',
    originalPrice: 3.49,
    promoPrice: 1.99,
    unit: 'lot',
    validFrom: '2026-09-03',
    validUntil: '2026-09-08',
    image: null,
    description: 'Silvercrest - Tapis change bébé',
  },
]

/**
 * Fetch promotions for nearby stores.
 * Simulates an async API call. In production, replace with real HTTP requests.
 *
 * @param {string[]} [storeIds] - Optional filter by store IDs
 * @param {string} [category] - Optional filter by category
 * @returns {Promise<Array>} Array of promotion objects
 */
export async function fetchPromotions(storeIds, category) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const nearbyIds = getNearbyStores().map((s) => s.id)

  let promos = MOCK_PROMOTIONS.filter((p) => nearbyIds.includes(p.storeId))

  if (storeIds?.length) {
    promos = promos.filter((p) => storeIds.includes(p.storeId))
  }

  if (category) {
    promos = promos.filter((p) => p.category === category)
  }

  return promos
}

/**
 * Fetch all promotions (alias for convenience).
 */
export async function fetchAllPromotions() {
  return fetchPromotions()
}

/**
 * Get the best deals sorted by discount percentage.
 */
export async function fetchBestDeals(limit = 10) {
  const promos = await fetchPromotions()
  return promos
    .map((p) => ({
      ...p,
      discount: Math.round(((p.originalPrice - p.promoPrice) / p.originalPrice) * 100),
    }))
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit)
}

/**
 * Generate purchase suggestions based on promo data.
 * Suggests buying items that are on heavy discount (>30%).
 *
 * @returns {Promise<Array>} Suggested purchases
 */
export async function fetchSuggestions() {
  const promos = await fetchPromotions()

  return promos
    .map((p) => ({
      ...p,
      discount: Math.round(((p.originalPrice - p.promoPrice) / p.originalPrice) * 100),
      savings: +(p.originalPrice - p.promoPrice).toFixed(2),
    }))
    .filter((p) => p.discount >= 30)
    .sort((a, b) => b.discount - a.discount)
}
