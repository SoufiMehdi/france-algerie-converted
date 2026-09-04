import { useState } from 'react'
import { DEFAULT_EXCHANGE_RATE, DEFAULT_PROFIT_MARGIN } from '../constants'

/**
 * Form to create a new voyage with name, exchange rate, and profit margin.
 */
export default function CreateVoyageForm({ onAdd }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    exchangeRate: String(DEFAULT_EXCHANGE_RATE),
    profitMargin: String(DEFAULT_PROFIT_MARGIN),
  })

  const handleCreate = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    onAdd({
      name: formData.name.trim(),
      exchangeRate: parseFloat(formData.exchangeRate) || DEFAULT_EXCHANGE_RATE,
      profitMargin: parseFloat(formData.profitMargin) || DEFAULT_PROFIT_MARGIN,
      createdAt: new Date().toLocaleDateString('fr-FR'),
    })

    setFormData({
      name: '',
      exchangeRate: String(DEFAULT_EXCHANGE_RATE),
      profitMargin: String(DEFAULT_PROFIT_MARGIN),
    })
    setShowForm(false)
  }

  return (
    <>
      <div className="voyage-list-header">
        <h2>🧳 Mes Voyages</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ Annuler' : '➕ Nouveau Voyage'}
        </button>
      </div>

      {showForm && (
        <div className="create-voyage-card">
          <h3>Créer un nouveau voyage</h3>
          <form onSubmit={handleCreate} className="voyage-form">
            <div className="form-grid-3">
              <div className="form-group">
                <label htmlFor="vname">Nom du voyage</label>
                <input
                  id="vname"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: Voyage Mars 2026"
                  className="input"
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="vrate">Taux EUR → DZD</label>
                <input
                  id="vrate"
                  type="number"
                  value={formData.exchangeRate}
                  onChange={(e) => setFormData((p) => ({ ...p, exchangeRate: e.target.value }))}
                  step="0.1"
                  min="1"
                  className="input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="vmargin">Marge (%)</label>
                <input
                  id="vmargin"
                  type="number"
                  value={formData.profitMargin}
                  onChange={(e) => setFormData((p) => ({ ...p, profitMargin: e.target.value }))}
                  step="5"
                  min="0"
                  max="500"
                  className="input"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Créer le voyage
            </button>
          </form>
        </div>
      )}
    </>
  )
}
