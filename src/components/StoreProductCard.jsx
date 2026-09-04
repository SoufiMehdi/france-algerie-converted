import { CATEGORY_EMOJIS } from '../constants'

/**
 * Public product card for the storefront.
 * Shows photo (or emoji fallback), name, price, description, and WhatsApp order button.
 */
export default function StoreProductCard({ product, whatsappNumber }) {
  const handleOrder = () => {
    const msg = encodeURIComponent(
      `Bonjour ! Je veux commander :\n\n📦 ${product.name}\n💰 Prix : ${product.sellingPriceDZD.toLocaleString()} DZD\n📦 Qté : ${product.quantity}`,
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank')
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

      {/* Order button */}
      {whatsappNumber && (
        <button onClick={handleOrder} className="btn-order">
          🛒 Commander sur WhatsApp
        </button>
      )}
    </div>
  )
}
