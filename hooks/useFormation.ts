import { useState, useEffect, useCallback } from 'react'
import { FormationDetailed } from '@/types/formation'

export const useFormation = (slug: string) => {
  const [data, setData] = useState<FormationDetailed | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFormation = useCallback(async () => {
    if (!slug) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/formations/${slug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Formation non trouvée')
        }
        throw new Error('Erreur lors du chargement de la formation')
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchFormation()
  }, [fetchFormation])

  const refetch = useCallback(() => {
    fetchFormation()
  }, [fetchFormation])

  return {
    data,
    isLoading,
    error,
    refetch
  }
}