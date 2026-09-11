import { CATEGORY_EMOJIS } from '../constants'

/**
 * Slide-in cart drawer panel.
 * Shows items, quantity controls, total price, and order via WhatsApp.
 */
export default function CartDrawer({ items, totalItems, totalPrice, onUpdateQuantity, onRemove, onClear, onClose, whatsappNumber }) {
  const handleOrder = () => {
    if (!whatsappNumber || items.length === 0) return
    const lines = items.map(
      (item) => `📦 ${item.name} × ${item.quantity} — ${item.price.toLocaleString()} DZD`,
    )
    const msg = encodeURIComponent(
      `Bonjour ! Je veux commander :\n\n${lines.join('\n')}\n\n💰 Total : ${totalPrice.toLocaleString()} DZD`,
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank')
  }

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h2>🛒 Mon panier ({totalItems})</h2>
          <button onClick={onClose} className="cart-close" title="Fermer">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Votre panier est vide</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    {item.photoURL ? (
                      <img src={item.photoURL} alt={item.name} />
                    ) : (
                      <span className="cart-item-emoji">
                        {CATEGORY_EMOJIS[item.category] || '📦'}
                      </span>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">
                      {item.price.toLocaleString()} DZD
                    </span>
                    <div className="cart-item-qty">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="cart-item-remove"
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span className="cart-total-price">{totalPrice.toLocaleString()} DZD</span>
              </div>
              <div className="cart-actions">
                <button onClick={onClear} className="btn-clear-cart">
                  🗑️ Vider
                </button>
                {whatsappNumber && (
                  <button onClick={handleOrder} className="btn-order-cart">
                    📱 Commander ({items.length} article{items.length > 1 ? 's' : ''})
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
