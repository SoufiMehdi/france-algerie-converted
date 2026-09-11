import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

/**
 * Get or create a persistent device ID stored in localStorage.
 * Used to identify a user's cart across sessions.
 */
function getDeviceId() {
  let id = localStorage.getItem('device_id')
  if (!id) {
    id = `device_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem('device_id', id)
  }
  return id
}

/**
 * Custom hook to manage a shopping cart persisted in Firestore.
 *
 * @param {string} storeId - The store identifier (e.g. 'admin')
 * @returns {[Array, Object]} [cartItems, cartActions]
 */
export function useCart(storeId = 'admin') {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const deviceId = getDeviceId()
  const cartRef = doc(db, `${storeId}_carts`, deviceId)

  // Listen to real-time cart updates from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      cartRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setItems(snapshot.data().items || [])
        } else {
          setItems([])
        }
        setLoading(false)
      },
      (error) => {
        console.error('Cart Firestore error:', error)
        setLoading(false)
      },
    )
    return () => unsubscribe()
  }, [storeId, cartRef])

  // Save cart to Firestore
  const saveCart = useCallback(
    (newItems) => {
      setDoc(cartRef, { items: newItems, updatedAt: Date.now() }).catch((err) =>
        console.error('Error saving cart:', err),
      )
    },
    [cartRef],
  )

  const addItem = useCallback(
    (product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id)
        let newItems
        if (existing) {
          newItems = prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        } else {
          newItems = [
            ...prev,
            {
              id: product.id,
              name: product.name,
              price: product.sellingPriceDZD,
              priceEUR: product.priceEUR,
              quantity,
              photoURL: product.photoURL || '',
              category: product.category || '',
            },
          ]
        }
        saveCart(newItems)
        return newItems
      })
    },
    [saveCart],
  )

  const removeItem = useCallback(
    (productId) => {
      setItems((prev) => {
        const newItems = prev.filter((item) => item.id !== productId)
        saveCart(newItems)
        return newItems
      })
    },
    [saveCart],
  )

  const updateQuantity = useCallback(
    (productId, quantity) => {
      if (quantity <= 0) {
        removeItem(productId)
        return
      }
      setItems((prev) => {
        const newItems = prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        )
        saveCart(newItems)
        return newItems
      })
    },
    [saveCart, removeItem],
  )

  const clearCart = useCallback(() => {
    saveCart([])
    setItems([])
  }, [saveCart])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }
}
