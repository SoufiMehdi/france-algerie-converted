/**
 * Store definitions.
 * Each store has an id, name, color for UI, and geolocation
 * centered on Beaumont (63) — 10 km radius.
 */

// ── Beaumont (63) center coordinates ──────────────────────────
export const BEAUMONT_COORDS = { lat: 45.7558, lng: 3.0848 }
export const SEARCH_RADIUS_KM = 10

/**
 * Convert km to approximate lat/lng delta (for radius filtering).
 * At 45°N latitude: 1° lat ≈ 111 km, 1° lng ≈ 78 km
 */
export const LAT_DELTA = 10 / 111 // ≈ 0.09
export const LNG_DELTA = 10 / 78 // ≈ 0.128

// ── Stores near Beaumont (63) ─────────────────────────────────
// Real addresses based on known store locations in the Clermont-Ferrand area.
export const STORES = [
  {
    id: 'auchan',
    name: 'Auchan',
    color: '#E30613',
    lat: 45.7789,
    lng: 3.1205,
    address: "Centre Auchan - Rue de l'Industrie, 63100 Clermont-Ferrand",
  },
  {
    id: 'aldi',
    name: 'Aldi',
    color: '#0075BE',
    lat: 45.7402,
    lng: 3.0672,
    address: 'Aldi - Route de Clermont, 63114 Beaumont',
  },
  {
    id: 'leclerc',
    name: 'Leclerc',
    color: '#0066CC',
    lat: 45.7692,
    lng: 3.1102,
    address: 'E.Leclerc - Place de la République, 63100 Clermont-Ferrand',
  },
  {
    id: 'yvrochet',
    name: 'Yvroché',
    color: '#E85D04',
    lat: 45.7510,
    lng: 3.0955,
    address: 'Yvroché - Rue du Commerce, 63114 Beaumont',
  },
  {
    id: 'action',
    name: 'Action',
    color: '#FF6600',
    lat: 45.7625,
    lng: 3.0780,
    address: 'Action - Avenue de la République, 63000 Clermont-Ferrand',
  },
  {
    id: 'lidl',
    name: 'Lidl',
    color: '#0050AA',
    lat: 45.7835,
    lng: 3.0598,
    address: 'Lidl - Route de Vichy, 63100 Clermont-Ferrand',
  },
]

/**
 * Filter stores within SEARCH_RADIUS_KM of BEAUMONT_COORDS.
 */
export function getNearbyStores(stores = STORES) {
  return stores.filter((store) => {
    const dlat = Math.abs(store.lat - BEAUMONT_COORDS.lat)
    const dlng = Math.abs(store.lng - BEAUMONT_COORDS.lng)
    return dlat <= LAT_DELTA && dlng <= LNG_DELTA
  })
}

