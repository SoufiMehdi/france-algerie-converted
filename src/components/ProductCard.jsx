import { CATEGORY_EMOJIS } from '../constants'

/**
 * Displays a single product with EUR→DZD price conversion and profit.
 */
export default function ProductCard({ product, onRemove }) {
  return (
    <div className="product-card">
      <div className="product-header">
        <span className="product-emoji">
          {CATEGORY_EMOJIS[product.category] || '📦'}
        </span>
        <div className="product-info">
          <h3>{product.name}</h3>
          <span className="product-category">{product.category}</span>
        </div>
        <button
          onClick={() => {
            if (window.confirm(`Supprimer "${product.name}" ?`)) onRemove()
          }}
          className="btn-remove"
          title="Supprimer"
        >
          ✕
        </button>
      </div>

      <div className="product-prices">
        <div className="price-row">
          <span className="price-label">Prix d'achat</span>
          <span className="price-eur">{product.priceEUR.toFixed(2)}€</span>
        </div>
        <div className="price-arrow">↓</div>
        <div className="price-row">
          <span className="price-label">Prix de vente</span>
          <span className="price-dzd">{product.sellingPriceDZD.toLocaleString()} DZD</span>
        </div>
      </div>

      <div className="product-details">
        <div className="detail"><span>📦 Qté: {product.quantity}</span></div>
        <div className="detail"><span>💵 Coût: {product.totalCostDZD.toLocaleString()} DZD</span></div>
        <div className="detail"><span>📈 Vente: {product.totalSellingDZD.toLocaleString()} DZD</span></div>
        <div className="detail profit"><span>💰 Profit: +{product.profit.toLocaleString()} DZD</span></div>
      </div>
    </div>
  )
}
