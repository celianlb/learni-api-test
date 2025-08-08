import { useState, useEffect, useCallback, useMemo } from 'react'
import { FormationFilters, FormationSearchResult, FormationFiltersData } from '@/types/formation'

export const useFormations = (initialFilters: FormationFilters = {}) => {
  const [data, setData] = useState<FormationSearchResult | null>(null)
  const [filtersData, setFiltersData] = useState<FormationFiltersData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FormationFilters>({
    page: 1,
    limit: 20,
    ...initialFilters
  })

  const searchParams = useMemo(() => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    return params.toString()
  }, [filters])

  const fetchFormations = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/formations?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch formations')
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  const fetchFiltersData = useCallback(async () => {
    try {
      const response = await fetch('/api/formations/filters')
      if (!response.ok) {
        throw new Error('Failed to fetch filters data')
      }
      
      const result = await response.json()
      setFiltersData(result)
    } catch (err) {
      console.error('Failed to fetch filters data:', err)
    }
  }, [])

  useEffect(() => {
    fetchFormations()
  }, [searchParams]) // Utilise directement searchParams au lieu de fetchFormations

  useEffect(() => {
    fetchFiltersData()
  }, []) // Pas de dépendance car on veut charger les filtres qu'une seule fois

  const updateFilter = useCallback((key: keyof FormationFilters, value: FormationFilters[keyof FormationFilters]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? (value as number) : 1
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20
    })
  }, [])

  const setPage = useCallback((page: number) => {
    updateFilter('page', page)
  }, [updateFilter])

  return {
    data,
    filtersData,
    isLoading,
    error,
    filters,
    updateFilter,
    resetFilters,
    setPage,
    refetch: fetchFormations
  }
}