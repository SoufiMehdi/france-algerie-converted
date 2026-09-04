/**
 * Displays aggregated totals: total cost, selling price, and profit.
 */
export default function ProductSummary({ totals, visible }) {
  if (!visible) return null

  return (
    <div className="summary-card">
      <div className="summary-grid">
        <div className="summary-item">
          <span className="summary-label">Coût total (EUR)</span>
          <span className="summary-value">{totals.totalCostEUR.toFixed(2)}€</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Coût total (DZD)</span>
          <span className="summary-value">{totals.totalCostDZD.toLocaleString()} DZD</span>
        </div>
        <div className="summary-item highlight-green">
          <span className="summary-label">Prix de vente total</span>
          <span className="summary-value">{totals.totalSellingDZD.toLocaleString()} DZD</span>
        </div>
        <div className="summary-item highlight-profit">
          <span className="summary-label">💰 Profit total</span>
          <span className="summary-value">{totals.totalProfit.toLocaleString()} DZD</span>
        </div>
      </div>
    </div>
  )
}
