/**
 * Public storefront header.
 * Shows store name, description, and a WhatsApp contact button.
 */
export default function StoreHeader({ storeName, description, whatsappNumber }) {
  const handleWhatsApp = () => {
    if (!whatsappNumber) return
    const msg = encodeURIComponent(`Bonjour ! Je suis intéressé(e) par vos produits. Merci !`)
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank')
  }

  return (
    <header className="store-header">
      <div className="store-header-content">
        <div className="store-brand">🇫🇷 ➜ 🇩🇿</div>
        <h1 className="store-title">{storeName}</h1>
        <p className="store-desc">{description}</p>
        {whatsappNumber && (
          <button onClick={handleWhatsApp} className="btn-whatsapp">
            💬 Nous contacter sur WhatsApp
          </button>
        )}
      </div>
    </header>
  )
}
