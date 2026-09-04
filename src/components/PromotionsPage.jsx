import { useState } from 'react'
import { usePromotions } from '../hooks/usePromotions'
import { STORES, PROMO_CATEGORIES, getNearbyStores } from '../constants/stores'
import PromotionCard from './PromotionCard'
import PromotionSuggestion from './PromotionSuggestion'

const nearbyStores = getNearbyStores()

/**
 * Promotions page — displays deals from nearby stores within 10 km of Beaumont (63).
 * Includes smart purchase suggestions and store/category filters.
 */
export default function PromotionsPage() {
  const [selectedStore, setSelectedStore] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const { promos, suggestions, loading, error } = usePromotions({
    storeIds: selectedStore ? [selectedStore] : null,
    category: selectedCategory,
  })

  const handleStoreFilter = (storeId) => {
    setSelectedStore((prev) => (prev === storeId ? null : storeId))
  }

  const handleCategoryFilter = (catId) => {
    setSelectedCategory((prev) => (prev === catId ? null : catId))
  }

  // Group promos by store for the "all" view
  const groupedByStore = nearbyStores.map((store) => ({
    ...store,
    promos: promos.filter((p) => p.storeId === store.id),
  }))

  return (
    <div className="promotions-page">
      {/* Hero header */}
      <div className="promos-hero">
        <div className="promos-hero-content">
          <h1 className="promos-hero-title">🏷️ Promotions du quartier</h1>
          <p className="promos-hero-subtitle">
            Les meilleures affaires dans un rayon de 10 km autour de Beaumont (63)
          </p>
          <div className="promos-hero-stores">
            {nearbyStores.map((store) => (
              <span
                key={store.id}
                className="promos-hero-store-tag"
                style={{ backgroundColor: store.color, color: '#fff' }}
              >
                {store.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions section */}
      {suggestions.length > 0 && (
        <section className="promos-section promos-suggestions">
          <h2 className="promos-section-title">💡 Nos suggestions d'achat</h2>
          <p className="promos-section-subtitle">
            Les meilleures affaires du moment — ne manquez pas ces promos !
          </p>
          <div className="suggestions-grid">
            {suggestions.map((s, i) => (
              <PromotionSuggestion key={s.id} suggestion={s} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="promos-filters">
        {/* Store filter */}
        <div className="promos-filter-group">
          <h3 className="promos-filter-label">Magasins</h3>
          <div className="promos-filter-chips">
            <button
              className={`promos-chip ${!selectedStore ? 'promos-chip-active' : ''}`}
              onClick={() => setSelectedStore(null)}
            >
              Tous
            </button>
            {nearbyStores.map((store) => (
              <button
                key={store.id}
                className={`promos-chip ${selectedStore === store.id ? 'promos-chip-active' : ''}`}
                style={
                  selectedStore === store.id
                    ? { backgroundColor: store.color, color: '#fff', borderColor: store.color }
                    : {}
                }
                onClick={() => handleStoreFilter(store.id)}
              >
                {store.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="promos-filter-group">
          <h3 className="promos-filter-label">Catégories</h3>
          <div className="promos-filter-chips">
            <button
              className={`promos-chip ${!selectedCategory ? 'promos-chip-active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              Toutes
            </button>
            {PROMO_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`promos-chip ${selectedCategory === cat.id ? 'promos-chip-active' : ''}`}
                onClick={() => handleCategoryFilter(cat.id)}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <div className="promos-loading">
          <div className="promos-spinner" />
          <p>Chargement des promotions…</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="promos-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Promos grid */}
      {!loading && !error && (
        <section className="promos-section">
          {selectedStore ? (
            // Single store view
            <>
              <h2 className="promos-section-title">
                {nearbyStores.find((s) => s.id === selectedStore)?.name || selectedStore}
              </h2>
              <div className="promos-grid">
                {promos.map((promo) => (
                  <PromotionCard key={promo.id} promotion={promo} />
                ))}
              </div>
              {promos.length === 0 && (
                <div className="promos-empty">
                  Aucune promotion en cours pour ce magasin.
                </div>
              )}
            </>
          ) : (
            // All stores — grouped view
            groupedByStore.map((store) => (
              <div key={store.id} className="promos-store-group">
                <h2 className="promos-section-title">
                  <span
                    className="promos-store-dot"
                    style={{ backgroundColor: store.color }}
                  />
                  {store.name}
                  <span className="promos-store-count">{store.promos.length} promo{store.promos.length !== 1 ? 's' : ''}</span>
                </h2>
                {store.promos.length > 0 ? (
                  <div className="promos-grid">
                    {store.promos.map((promo) => (
                      <PromotionCard key={promo.id} promotion={promo} />
                    ))}
                  </div>
                ) : (
                  <div className="promos-empty-inline">
                    Pas de promotion en cours.
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      )}

      {/* Info footer */}
      <section className="promos-info">
        <h3>📍 Magasins proches de Beaumont (63)</h3>
        <div className="promos-info-grid">
          {nearbyStores.map((store) => (
            <div key={store.id} className="promos-info-card">
              <span
                className="promos-info-dot"
                style={{ backgroundColor: store.color }}
              />
              <div>
                <strong>{store.name}</strong>
                <p className="promos-info-address">{store.address}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
