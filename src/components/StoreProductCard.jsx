import { useState } from 'react'
import { CATEGORY_EMOJIS } from '../constants'

/**
 * Public product card for the storefront.
 * Shows photo (or emoji fallback), name, price, description, and add-to-cart button.
 */
export default function StoreProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="store-product-card">
      {/* Photo or emoji placeholder */}
      <div className="store-product-image">
        {product.photoURL ? (
          <img src={product.photoURL} alt={product.name} loading="lazy" />
        ) : (
          <span className="store-product-emoji">
            {CATEGORY_EMOJIS[product.category] || '📦'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="store-product-body">
        <span className="store-product-category">{product.category}</span>
        <h3 className="store-product-name">{product.name}</h3>
        {product.description && (
          <p className="store-product-desc">{product.description}</p>
        )}
        <div className="store-product-price">
          {product.sellingPriceDZD.toLocaleString()} DZD
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        className={`btn-add-cart ${added ? 'btn-added' : ''}`}
      >
        {added ? '✓ Ajouté' : '🛒 Ajouter au panier'}
      </button>
    </div>
  )
}
