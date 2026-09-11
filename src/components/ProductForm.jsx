import { useState, useRef } from 'react'
import { CATEGORIES, DEFAULT_EXCHANGE_RATE, DEFAULT_PROFIT_MARGIN } from '../constants'
import { calculatePrices } from '../utils/priceCalculator'
import { imageToBase64 } from '../utils/uploadImage'

/**
 * Form to add a product to the current voyage.
 * Includes photo upload and description for the storefront.
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
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image.')
      return
    }

    // Validate file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 Mo.")
      return
    }

    setPhotoFile(file)

    // Create a local preview
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    setFormData((prev) => ({ ...prev, photoURL: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.priceEUR) return

    setUploading(true)
    try {
      // Convert photo to base64 if one is selected
      let imageURL = formData.photoURL
      if (photoFile) {
        imageURL = await imageToBase64(photoFile)
      }

      const priceEUR = parseFloat(formData.priceEUR)
      const qty = parseInt(formData.quantity) || 1

      onSubmit({
        name: formData.name.trim(),
        priceEUR,
        quantity: qty,
        category: formData.category || 'Autre',
        description: formData.description.trim(),
        photoURL: imageURL,
        dateAdded: new Date().toLocaleDateString('fr-FR'),
      })

      // Reset form
      setFormData({ name: '', priceEUR: '', quantity: 1, category: '', description: '', photoURL: '' })
      setPhotoFile(null)
      setPhotoPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      console.error("Erreur lors de l'upload de l'image :", err)
      alert("Erreur lors de l'upload. Veuillez réessayer.")
    } finally {
      setUploading(false)
    }
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
            <label htmlFor="pphoto">Photo du produit (optionnel)</label>
            <input
              ref={fileInputRef}
              id="pphoto"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="input input-file"
            />
            {photoPreview && (
              <div className="photo-preview">
                <img src={photoPreview} alt="Aperçu" className="photo-preview-img" />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="btn-remove-photo"
                  title="Supprimer la photo"
                >
                  ✕
                </button>
              </div>
            )}
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

        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? '⏳ Upload en cours...' : 'Ajouter'}
        </button>
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
