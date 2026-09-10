import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

/**
 * React hook that persists state to Firestore.
 * API is similar to useLocalStorage — drop-in replacement.
 *
 * @param {string} collectionName - Firestore collection name
 * @param {string} docId - Document ID (e.g. 'settings', 'voyages')
 * @param {*} initialValue - Default value if document doesn't exist
 */
export function useFirestore(collectionName, docId, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(true)

  // Listen to real-time updates from Firestore
  useEffect(() => {
    const docRef = doc(db, collectionName, docId)

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setValue(snapshot.data().data)
        } else {
          // Document doesn't exist yet, create it with initial value
          setDoc(docRef, { data: initialValue })
          setValue(initialValue)
        }
        setLoading(false)
      },
      (error) => {
        console.error('Firestore error:', error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [collectionName, docId])

  // Update function — saves to Firestore
  const updateValue = (updater) => {
    setValue((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      const docRef = doc(db, collectionName, docId)
      setDoc(docRef, { data: next }).catch((err) =>
        console.error('Error saving to Firestore:', err),
      )
      return next
    })
  }

  return [value, updateValue, loading]
}
