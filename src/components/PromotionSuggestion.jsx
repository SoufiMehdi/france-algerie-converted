import { STORES } from '../constants/stores'

/**
 * Smart purchase suggestion card — highlights the best deals
 * and recommends what to buy based on discount analysis.
 */
export default function PromotionSuggestion({ suggestion, rank }) {
  const store = STORES.find((s) => s.id === suggestion.storeId)

  // Determine urgency level
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(suggestion.validUntil) - new Date()) / (1000 * 60 * 60 * 24)),
  )

  const urgencyLevel =
    suggestion.discount >= 50 ? 'excellent' :
    suggestion.discount >= 40 ? 'very-good' :
    'good'

  const urgencyLabels = {
    excellent: { text: '🔥 Achat recommandé', color: '#E30613' },
    'very-good': { text: '⭐ Très bonne affaire', color: '#E85D04' },
    good: { text: '👍 Bon plan', color: '#00875A' },
  }

  const { text: urgencyText, color: urgencyColor } = urgencyLabels[urgencyLevel]

  return (
    <div className={`suggestion-card suggestion-${urgencyLevel}`}>
      <div className="suggestion-rank">#{rank}</div>

      <div
        className="suggestion-store-tag"
        style={{ backgroundColor: store?.color || '#666' }}
      >
        {store?.name}
      </div>

      <div className="suggestion-body">
        <h4 className="suggestion-title">{suggestion.title}</h4>
        {suggestion.description && (
          <p className="suggestion-desc">{suggestion.description}</p>
        )}

        <div className="suggestion-pricing">
          <span className="suggestion-old-price">{suggestion.originalPrice.toFixed(2)} €</span>
          <span className="suggestion-new-price">{suggestion.promoPrice.toFixed(2)} €</span>
        </div>

        <div className="suggestion-stats">
          <span className="suggestion-discount" style={{ color: urgencyColor }}>
            -{suggestion.discount}%
          </span>
          <span className="suggestion-savings">
            Économie : {suggestion.savings.toFixed(2)} €
          </span>
        </div>
      </div>

      <div className="suggestion-footer">
        <span className="suggestion-urgency" style={{ color: urgencyColor }}>
          {urgencyText}
        </span>
        {daysLeft <= 2 && (
          <span className="suggestion-expiry">⏰ Valable {daysLeft} jour{daysLeft > 1 ? 's' : ''} !</span>
        )}
      </div>
    </div>
  )
}
