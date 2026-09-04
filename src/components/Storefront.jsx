import StoreHeader from './StoreHeader'
import StoreProductCard from './StoreProductCard'
import { calculatePrices } from '../utils/priceCalculator'

/**
 * Public storefront: displays products as a shareable catalog.
 * No admin features — purely read-only product display.
 */
export default function Storefront({ voyages, storeName, storeDescription, whatsappNumber }) {
  // Flatten all products from all voyages and enrich with selling prices
  const allProducts = voyages.flatMap((v) =>
    v.products.map((p) => {
      const { sellingPriceDZD } = calculatePrices(p.priceEUR, v.exchangeRate, v.profitMargin)
      return {
        ...p,
        sellingPriceDZD,
      }
    }),
  )

  // Get unique categories that have products
  const usedCategories = [...new Set(allProducts.map((p) => p.category))]

  return (
    <div className="storefront">
      <StoreHeader
        storeName={storeName}
        description={storeDescription}
        whatsappNumber={whatsappNumber}
      />

      <main className="store-main">
        {allProducts.length === 0 ? (
          <div className="store-empty">
            <div className="store-empty-icon">🏪</div>
            <h2>Boutique en cours de préparation</h2>
            <p>Revenez bientôt pour découvrir nos produits !</p>
          </div>
        ) : (
          <>
            {/* Category filters */}
            <div className="store-filters">
              <button className="filter-btn active">Tout</button>
              {usedCategories.map((cat) => (
                <button key={cat} className="filter-btn">{cat}</button>
              ))}
            </div>

            {/* Products grid */}
            <div className="store-products-grid">
              {allProducts.map((product) => (
                <StoreProductCard
                  key={product.id}
                  product={product}
                  whatsappNumber={whatsappNumber}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="store-footer">
        <p>🇫🇷 Importé de France | Livraison en Algérie 🇩🇿</p>
      </footer>
    </div>
  )
}
