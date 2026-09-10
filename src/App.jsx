import { useState, useEffect } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useFirestore } from './hooks/useFirestore'
import { auth } from './lib/firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import VoyageList from './components/VoyageList'
import VoyageDetail from './components/VoyageDetail'
import Storefront from './components/Storefront'
import StoreSettings from './components/StoreSettings'
import LoginPage from './components/LoginPage'
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
  const [voyages, setVoyages] = useFirestore('admin', 'voyages', [])
  const [view, setView] = useFirestore('admin', 'view', { page: 'list', voyageId: null })
  const [storeSettings, setStoreSettings] = useFirestore('admin', 'store', {
    storeName: DEFAULT_STORE_NAME,
    storeDescription: DEFAULT_STORE_DESCRIPTION,
    whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  })
  const [adminTab, setAdminTab] = useState('voyages')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
      setLoadingAuth(false)
    })
    return () => unsubscribe()
  }, [])

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

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
  }

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
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          {adminTab === 'voyages' && view.page === 'detail' && (
            <button onClick={goBack} className="btn-back">← Retour</button>
          )}
          <h1>🇫🇷 ➜ 🇩🇿 France → Algérie</h1>
          <p className="subtitle">Gérez vos voyages et calculez vos prix de vente</p>
          <div className="header-nav">
            <button onClick={() => setPage('boutique')} className="btn btn-store">
              🏪 Voir la boutique
            </button>
            <button onClick={handleLogout} className="btn btn-logout">
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${adminTab === 'voyages' ? 'admin-tab-active' : ''}`}
            onClick={() => { setAdminTab('voyages'); goBack() }}
          >
            🧳 Voyages
          </button>
          <button
            className={`admin-tab ${adminTab === 'boutique' ? 'admin-tab-active' : ''}`}
            onClick={() => setAdminTab('boutique')}
          >
            🏪 Boutique
          </button>
        </div>

        {adminTab === 'voyages' && (
          view.page === 'list' ? (
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
          )
        )}

        {adminTab === 'boutique' && (
          <StoreSettings settings={storeSettings} onSave={setStoreSettings} />
        )}
      </main>

      <footer className="footer">
        <p>France → Algérie | Convertisseur de prix</p>
      </footer>
    </div>
  )
}
