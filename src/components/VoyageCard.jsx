import { calculateVoyageStats } from '../utils/priceCalculator'

/**
 * A single voyage card displayed on the home page.
 * Shows name, date, stats, and a delete button.
 */
export default function VoyageCard({ voyage, onOpen, onRemove }) {
  const stats = calculateVoyageStats(
    voyage.products,
    voyage.exchangeRate,
    voyage.profitMargin,
  )

  return (
    <div className="voyage-card" onClick={() => onOpen(voyage.id)}>
      <div className="voyage-card-header">
        <div className="voyage-card-title">
          <span className="voyage-flag">✈️</span>
          <div>
            <h3>{voyage.name}</h3>
            <span className="voyage-date">{voyage.createdAt}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (window.confirm(`Supprimer le voyage "${voyage.name}" ?`)) {
              onRemove(voyage.id)
            }
          }}
          className="btn-remove"
          title="Supprimer"
        >
          🗑️
        </button>
      </div>

      <div className="voyage-card-settings">
        <span className="badge">💱 {voyage.exchangeRate} DZD</span>
        <span className="badge badge-green">📈 {voyage.profitMargin}%</span>
      </div>

      <div className="voyage-card-stats">
        <div className="stat">
          <span className="stat-value">{stats.totalProducts}</span>
          <span className="stat-label">Produits</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.totalCostEUR.toFixed(0)}€</span>
          <span className="stat-label">Coût</span>
        </div>
        <div className="stat stat-profit">
          <span className="stat-value">
            {stats.totalSellingDZD > 0 ? `+${stats.totalProfit.toLocaleString()}` : '0'} DZD
          </span>
          <span className="stat-label">💰 Profit</span>
        </div>
      </div>

      <div className="voyage-card-footer">Voir les produits →</div>
    </div>
  )
}
