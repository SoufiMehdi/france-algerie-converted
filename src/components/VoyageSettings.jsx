import { useState } from 'react'
import { DEFAULT_EXCHANGE_RATE, DEFAULT_PROFIT_MARGIN } from '../constants'

/**
 * Inline panel to edit a voyage's exchange rate and profit margin.
 */
export default function VoyageSettings({ voyage, onSave, onCancel }) {
  const [data, setData] = useState({
    exchangeRate: String(voyage.exchangeRate),
    profitMargin: String(voyage.profitMargin),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      exchangeRate: parseFloat(data.exchangeRate) || DEFAULT_EXCHANGE_RATE,
      profitMargin: parseFloat(data.profitMargin) || DEFAULT_PROFIT_MARGIN,
    })
  }

  return (
    <div className="settings-card">
      <h3>Paramètres du voyage</h3>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-grid-3">
          <div className="form-group">
            <label>Taux EUR → DZD</label>
            <input
              type="number"
              value={data.exchangeRate}
              onChange={(e) => setData((p) => ({ ...p, exchangeRate: e.target.value }))}
              step="0.1"
              min="1"
              className="input"
            />
            <span className="setting-hint">Taux officiel actuel : ~154.5 DZD</span>
          </div>
          <div className="form-group">
            <label>Marge bénéficiaire (%)</label>
            <input
              type="number"
              value={data.profitMargin}
              onChange={(e) => setData((p) => ({ ...p, profitMargin: e.target.value }))}
              step="5"
              min="0"
              max="500"
              className="input"
            />
            <span className="setting-hint">{data.profitMargin}% de marge</span>
          </div>
        </div>
        <div className="settings-actions">
          <button type="submit" className="btn btn-primary">Sauvegarder</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">Annuler</button>
        </div>
      </form>
    </div>
  )
}
