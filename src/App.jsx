import { useState, useEffect } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import VoyageList from './components/VoyageList'
import VoyageDetail from './components/VoyageDetail'
import Storefront from './components/Storefront'
import StoreSettings from './components/StoreSettings'
import { DEFAULT_STORE_NAME, DEFAULT_STORE_DESCRIPTION, DEFAULT_WHATSAPP_NUMBER } from './constants'
import './styles/layout.css'
import './styles/storefront.css'

/**
 * App root with two modes:
 *  - Admin (#admin): voyage management + calculator
 *  - Public (#boutique): storefront for customers
 *
 * URL hash determines which mode is shown.
 */
export default function App() {
  const [voyages, setVoyages] = useLocalStorage('france-algerie-voyages', [])
  const [view, setView] = useLocalStorage('france-algerie-view', { page: 'list', voyageId: null })
  const [storeSettings, setStoreSettings] = useLocalStorage('france-algerie-store', {
    storeName: DEFAULT_STORE_NAME,
    storeDescription: DEFAULT_STORE_DESCRIPTION,
    whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  })
  const [showStoreSettings, setShowStoreSettings] = useState(false)

  // Read initial route from URL hash
  const [page, setPage] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'boutique') return 'boutique'
    return 'admin'
  })

  // Sync URL hash
  useEffect(() => {
    window.location.hash = page
  }, [page])

  // Listen for hash changes (back/forward)
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'boutique') setPage('boutique')
      else setPage('admin')
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Update OG meta tags dynamically
  useEffect(() => {
    if (page === 'boutique') {
      document.title = `${storeSettings.storeName} — Boutique`
    } else {
      document.title = 'France → Algérie | Admin'
    }
  }, [page, storeSettings.storeName])

  // ── Voyage CRUD ──────────────────────────────────────────────
  const addVoyage = (v) =>
    setVoyages((prev) => [...prev, { ...v, id: Date.now(), products: [] }])

  const removeVoyage = (id) =>
    setVoyages((prev) => prev.filter((v) => v.id !== id))

  const updateVoyage = (id, updates) =>
    setVoyages((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)))

  // ── Product CRUD ─────────────────────────────────────────────
  const addProduct = (voyageId, product) =>
    setVoyages((prev) =>
      prev.map((v) =>
        v.id === voyageId
          ? { ...v, products: [...v.products, { ...product, id: Date.now() }] }
          : v,
      ),
    )

  const removeProduct = (voyageId, productId) =>
    setVoyages((prev) =>
      prev.map((v) =>
        v.id === voyageId
          ? { ...v, products: v.products.filter((p) => p.id !== productId) }
          : v,
      ),
    )

  // ── Navigation ───────────────────────────────────────────────
  const openVoyage = (id) => setView({ page: 'detail', voyageId: id })
  const goBack = () => setView({ page: 'list', voyageId: null })
  const currentVoyage = voyages.find((v) => v.id === view.voyageId)

  // ── PUBLIC: Storefront ───────────────────────────────────────
  if (page === 'boutique') {
    return (
      <Storefront
        voyages={voyages}
        storeName={storeSettings.storeName}
        storeDescription={storeSettings.storeDescription}
        whatsappNumber={storeSettings.whatsappNumber}
      />
    )
  }

  // ── ADMIN: Calculator ────────────────────────────────────────
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          {view.page === 'detail' && (
            <button onClick={goBack} className="btn-back">← Retour</button>
          )}
          <h1>🇫🇷 ➜ 🇩🇿 France → Algérie</h1>
          <p className="subtitle">Gérez vos voyages et calculez vos prix de vente</p>
          <div className="header-nav">
            <button onClick={() => setPage('boutique')} className="btn btn-store">
              🏪 Voir la boutique
            </button>
            <button onClick={() => setShowStoreSettings(!showStoreSettings)} className="btn btn-store-secondary">
              ⚙️ Boutique
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {showStoreSettings && (
          <StoreSettings settings={storeSettings} onSave={(s) => { setStoreSettings(s); setShowStoreSettings(false) }} />
        )}

        {view.page === 'list' ? (
          <VoyageList
            voyages={voyages}
            onAdd={addVoyage}
            onRemove={removeVoyage}
            onOpen={openVoyage}
          />
        ) : (
          currentVoyage && (
            <VoyageDetail
              voyage={currentVoyage}
              onAddProduct={addProduct}
              onRemoveProduct={removeProduct}
              onUpdateVoyage={updateVoyage}
            />
          )
        )}
      </main>

      <footer className="footer">
        <p>France → Algérie | Convertisseur de prix</p>
      </footer>
    </div>
  )
}
