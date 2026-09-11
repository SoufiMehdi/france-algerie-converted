/**
 * Public storefront header.
 * Shows store name, description, WhatsApp contact button, and cart icon.
 */
export default function StoreHeader({ storeName, description, whatsappNumber, totalItems, onOpenCart }) {
  const handleWhatsApp = () => {
    if (!whatsappNumber) return
    const msg = encodeURIComponent(`Bonjour ! Je suis intéressé(e) par vos produits. Merci !`)
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank')
  }

  return (
    <header className="store-header">
      <div className="store-header-content">
        <div className="store-header-top">
          <div className="store-brand">🇫🇷 ➜ 🇩🇿</div>
          <button
            onClick={onOpenCart}
            className="store-cart-btn"
            title="Voir le panier"
          >
            🛒
            {totalItems > 0 && (
              <span className="store-cart-badge">{totalItems}</span>
            )}
          </button>
        </div>
        <h1 className="store-title">{storeName}</h1>
        <p className="store-desc">{description}</p>
        <div className="store-header-actions">
          {whatsappNumber && (
            <button onClick={handleWhatsApp} className="btn-whatsapp">
              💬 Nous contacter sur WhatsApp
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
