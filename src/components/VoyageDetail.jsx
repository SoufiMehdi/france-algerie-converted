import { useState } from 'react'
import ProductForm from './ProductForm'
import ProductCard from './ProductCard'
import ProductSummary from './ProductSummary'
import VoyageSettings from './VoyageSettings'
import { calculateProductBreakdown, calculateTotals } from '../utils/priceCalculator'

/**
 * Detail page for a single voyage.
 * Composes: VoyageSettings, ProductForm, ProductCard, ProductSummary.
 */
export default function VoyageDetail({ voyage, onAddProduct, onRemoveProduct, onUpdateVoyage }) {
  const [showSummary, setShowSummary] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const enrichedProducts = voyage.products.map((p) =>
    calculateProductBreakdown(p, voyage.exchangeRate, voyage.profitMargin),
  )
  const totals = calculateTotals(enrichedProducts)

  const handleSaveSettings = (updates) => {
    onUpdateVoyage(voyage.id, updates)
    setShowSettings(false)
  }

  return (
    <div className="voyage-detail">
      {/* Header */}
      <div className="voyage-detail-header">
        <div className="voyage-detail-title">
          <span className="voyage-flag-lg">✈️</span>
          <div>
            <h2>{voyage.name}</h2>
            <span className="voyage-detail-date">{voyage.createdAt}</span>
          </div>
        </div>
        <div className="voyage-detail-badges">
          <span className="badge">💱 {voyage.exchangeRate} DZD/EUR</span>
          <span className="badge badge-green">📈 +{voyage.profitMargin}%</span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-secondary btn-sm"
          >
            ⚙️ Paramètres
          </button>
        </div>
      </div>

      {/* Settings */}
      {showSettings && (
        <VoyageSettings
          voyage={voyage}
          onSave={handleSaveSettings}
          onCancel={() => setShowSettings(false)}
        />
      )}

      {/* Add product form */}
      <ProductForm
        exchangeRate={voyage.exchangeRate}
        profitMargin={voyage.profitMargin}
        onSubmit={(data) => onAddProduct(voyage.id, data)}
      />

      {/* Products */}
      {enrichedProducts.length > 0 && (
        <section className="products-section">
          <div className="section-header">
            <h2>📋 Produits ({enrichedProducts.length})</h2>
            <button onClick={() => setShowSummary(!showSummary)} className="btn btn-secondary">
              {showSummary ? 'Masquer' : '📊 Résumé'}
            </button>
          </div>

          <ProductSummary totals={totals} visible={showSummary} />

          <div className="products-grid">
            {enrichedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onRemove={() => onRemoveProduct(voyage.id, p.id)}
              />
            ))}
          </div>
        </section>
      )}

      {enrichedProducts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Aucun produit</h3>
          <p>Ajoutez votre premier produit pour commencer à calculer vos prix de vente.</p>
        </div>
      )}
    </div>
  )
}
