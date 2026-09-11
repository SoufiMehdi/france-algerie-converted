import { useState } from 'react'
import StoreHeader from './StoreHeader'
import StoreProductCard from './StoreProductCard'
import CartDrawer from './CartDrawer'
import { useCart } from '../hooks/useCart'
import { calculatePrices } from '../utils/priceCalculator'

/**
 * Public storefront: displays products as a shareable catalog.
 * Includes a persistent shopping cart with Firestore backup.
 */
export default function Storefront({ voyages, storeName, storeDescription, whatsappNumber }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Tout')
  const cart = useCart()

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

  // Filter products by active category
  const filteredProducts =
    activeCategory === 'Tout'
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory)

  return (
    <div className="storefront">
      <StoreHeader
        storeName={storeName}
        description={storeDescription}
        whatsappNumber={whatsappNumber}
        totalItems={cart.totalItems}
        onOpenCart={() => setCartOpen(true)}
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
              <button
                className={`filter-btn ${activeCategory === 'Tout' ? 'active' : ''}`}
                onClick={() => setActiveCategory('Tout')}
              >
                Tout
              </button>
              {usedCategories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products grid */}
            <div className="store-products-grid">
              {filteredProducts.map((product) => (
                <StoreProductCard
                  key={product.id}
                  product={product}
                  whatsappNumber={whatsappNumber}
                  onAddToCart={cart.addItem}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Cart drawer */}
      {cartOpen && (
        <CartDrawer
          items={cart.items}
          totalItems={cart.totalItems}
          totalPrice={cart.totalPrice}
          onUpdateQuantity={cart.updateQuantity}
          onRemove={cart.removeItem}
          onClear={cart.clearCart}
          onClose={() => setCartOpen(false)}
          whatsappNumber={whatsappNumber}
        />
      )}

      <footer className="store-footer">
        <p>🇫🇷 Importé de France | Livraison en Algérie 🇩🇿</p>
      </footer>
    </div>
  )
}
