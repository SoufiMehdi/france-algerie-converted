import { STORES, PROMO_CATEGORIES } from '../constants/stores'

/**
 * Display a single promotion card with store branding, pricing, and discount badge.
 */
export default function PromotionCard({ promotion }) {
  const store = STORES.find((s) => s.id === promotion.storeId)
  const category = PROMO_CATEGORIES.find((c) => c.id === promotion.category)
  const discount = Math.round(
    ((promotion.originalPrice - promotion.promoPrice) / promotion.originalPrice) * 100,
  )
  const savings = (promotion.originalPrice - promotion.promoPrice).toFixed(2)

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(promotion.validUntil) - new Date()) / (1000 * 60 * 60 * 24)),
  )

  return (
    <div className="promo-card">
      {/* Store badge */}
      <div
        className="promo-store-badge"
        style={{ backgroundColor: store?.color || '#666' }}
      >
        {store?.name || promotion.storeId}
      </div>

      {/* Discount badge */}
      {discount >= 25 && (
        <div className={`promo-discount-badge ${discount >= 50 ? 'promo-discount-hot' : ''}`}>
          -{discount}%
        </div>
      )}

      {/* Image or category emoji */}
      <div className="promo-image">
        {promotion.image ? (
          <img src={promotion.image} alt={promotion.title} loading="lazy" />
        ) : (
          <span className="promo-emoji">{category?.emoji || '📦'}</span>
        )}
      </div>

      {/* Content */}
      <div className="promo-body">
        <span className="promo-category">{category?.label || promotion.category}</span>
        <h3 className="promo-title">{promotion.title}</h3>
        {promotion.description && (
          <p className="promo-description">{promotion.description}</p>
        )}

        {/* Pricing */}
        <div className="promo-pricing">
          <span className="promo-original-price">{promotion.originalPrice.toFixed(2)} €</span>
          <span className="promo-current-price">{promotion.promoPrice.toFixed(2)} €</span>
          <span className="promo-unit">/ {promotion.unit}</span>
        </div>

        {/* Savings line */}
        <div className="promo-savings">
          Vous économisez {savings} €
        </div>

        {/* Validity */}
        <div className="promo-validity">
          {daysLeft > 0 ? (
            <span className={`promo-days ${daysLeft <= 2 ? 'promo-days-urgent' : ''}`}>
              ⏳ Plus que {daysLeft} jour{daysLeft > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="promo-expired">❌ Offre expirée</span>
          )}
        </div>
      </div>

      {/* Store link */}
      {store?.promoUrl && (
        <a
          href={store.promoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="promo-link"
        >
          Voir sur {store.name} →
        </a>
      )}
    </div>
  )
}
