import { useState } from 'react'
import { CATEGORIES, DEFAULT_EXCHANGE_RATE, DEFAULT_PROFIT_MARGIN } from '../constants'
import { calculatePrices } from '../utils/priceCalculator'

/**
 * Form to add a product to the current voyage.
 * Includes photo URL and description for the storefront.
 * Shows a live price preview as the user types.
 */
export default function ProductForm({ exchangeRate, profitMargin, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    priceEUR: '',
    quantity: 1,
    category: '',
    description: '',
    photoURL: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.priceEUR) return

    const priceEUR = parseFloat(formData.priceEUR)
    const qty = parseInt(formData.quantity) || 1

    onSubmit({
      name: formData.name.trim(),
      priceEUR,
      quantity: qty,
      category: formData.category || 'Autre',
      description: formData.description.trim(),
      photoURL: formData.photoURL.trim(),
      dateAdded: new Date().toLocaleDateString('fr-FR'),
    })

    setFormData({ name: '', priceEUR: '', quantity: 1, category: '', description: '', photoURL: '' })
  }

  const previewPrice =
    formData.priceEUR
      ? calculatePrices(
          parseFloat(formData.priceEUR),
          exchangeRate || DEFAULT_EXCHANGE_RATE,
          profitMargin || DEFAULT_PROFIT_MARGIN,
        ).sellingPriceDZD
      : null

  return (
    <div className="form-card">
      <h2>➕ Ajouter un produit</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="pname">Nom du produit</label>
            <input
              id="pname"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Parfum Chanel"
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pprice">Prix en EUR (€)</label>
            <input
              id="pprice"
              name="priceEUR"
              type="number"
              value={formData.priceEUR}
              onChange={handleInputChange}
              placeholder="49.99"
              step="0.01"
              min="0.01"
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pqty">Quantité</label>
            <input
              id="pqty"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              className="input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pcat">Catégorie</label>
            <select
              id="pcat"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input"
            >
              <option value="">Choisir...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Storefront fields */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="pphoto">URL de la photo (optionnel)</label>
            <input
              id="pphoto"
              name="photoURL"
              type="url"
              value={formData.photoURL}
              onChange={handleInputChange}
              placeholder="https://exemple.com/photo.jpg"
              className="input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pdesc">Description (optionnel)</label>
            <input
              id="pdesc"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Beau parfum français..."
              className="input"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>

      {previewPrice !== null && (
        <div className="preview">
          <span className="preview-label">Aperçu :</span>
          <span className="preview-value">
            {parseFloat(formData.priceEUR).toFixed(2)}€ →{' '}
            {previewPrice.toLocaleString()} DZD
            <small> (×{formData.quantity})</small>
          </span>
        </div>
      )}
    </div>
  )
}
