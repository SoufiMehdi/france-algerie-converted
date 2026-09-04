import { useState, useEffect, useCallback } from 'react'
import { fetchPromotions, fetchSuggestions } from '../services/promotionsService'

/**
 * Hook to fetch and manage promotions.
 *
 * @param {object} [filters] - { storeIds: string[], category: string }
 * @returns {{ promos, suggestions, loading, error, refetch }}
 */
export function usePromotions(filters = {}) {
  const [promos, setPromos] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [promosData, suggestionsData] = await Promise.all([
        fetchPromotions(filters.storeIds, filters.category),
        fetchSuggestions(),
      ])

      setPromos(promosData)
      setSuggestions(suggestionsData)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des promotions')
    } finally {
      setLoading(false)
    }
  }, [filters.storeIds?.join(','), filters.category])

  useEffect(() => {
    load()
  }, [load])

  return { promos, suggestions, loading, error, refetch: load }
}
