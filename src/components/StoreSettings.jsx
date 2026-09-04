import { useState } from 'react'

/**
 * Admin panel to configure the public storefront settings.
 */
export default function StoreSettings({ settings, onSave }) {
  const [data, setData] = useState({ ...settings })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(data)
  }

  return (
    <div className="settings-card">
      <h3>🏪 Paramètres de la boutique</h3>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label>Nom de la boutique</label>
          <input
            type="text"
            value={data.storeName}
            onChange={(e) => setData((p) => ({ ...p, storeName: e.target.value }))}
            className="input"
            placeholder="Ma Boutique"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={data.storeDescription}
            onChange={(e) => setData((p) => ({ ...p, storeDescription: e.target.value }))}
            className="input"
            placeholder="Produits importés de France"
          />
        </div>
        <div className="form-group">
          <label>Numéro WhatsApp (format international sans +)</label>
          <input
            type="text"
            value={data.whatsappNumber}
            onChange={(e) => setData((p) => ({ ...p, whatsappNumber: e.target.value }))}
            className="input"
            placeholder="213555123456"
          />
          <span className="setting-hint">Ex: 213555123456 (code pays + numéro)</span>
        </div>
        <div className="form-group">
          <label>Lien de la boutique (à partager)</label>
          <div className="store-link-preview">
            <span>{window.location.origin}/boutique</span>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/boutique`)}
              className="btn btn-secondary btn-sm"
            >
              📋 Copier
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Sauvegarder</button>
      </form>
    </div>
  )
}
