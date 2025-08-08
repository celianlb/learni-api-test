import { useState, useEffect, useCallback, useMemo } from 'react'
import { FormationFilters, FormationWithCategory, FormationFiltersData } from '@/types/formation'

interface InfiniteFormationsData {
  formations: FormationWithCategory[]
  hasNextPage: boolean
  totalCount: number
}

export const useInfiniteFormations = (initialFilters: FormationFilters = {}) => {
  const [data, setData] = useState<InfiniteFormationsData>({
    formations: [],
    hasNextPage: true,
    totalCount: 0
  })
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

  const fetchFormations = useCallback(async (isLoadMore = false) => {
    if (isLoading && isLoadMore) return
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/formations?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch formations')
      }
      
      const result = await response.json()
      
      if (isLoadMore) {
        setData(prev => ({
          formations: [...prev.formations, ...result.formations],
          hasNextPage: result.hasNextPage,
          totalCount: result.totalCount
        }))
      } else {
        setData({
          formations: result.formations,
          hasNextPage: result.hasNextPage,
          totalCount: result.totalCount
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [searchParams, isLoading])

  const loadMore = useCallback(async () => {
    if (!data.hasNextPage || isLoading) return

    const nextPage = Math.floor(data.formations.length / (filters.limit || 20)) + 1
    const newFilters = { ...filters, page: nextPage }
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })

    setIsLoading(true)
    try {
      const response = await fetch(`/api/formations?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch formations')
      }
      
      const result = await response.json()
      
      setData(prev => ({
        formations: [...prev.formations, ...result.formations],
        hasNextPage: result.hasNextPage,
        totalCount: result.totalCount
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [data.hasNextPage, data.formations.length, filters, isLoading])

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
  }, [searchParams])

  useEffect(() => {
    fetchFiltersData()
  }, [fetchFiltersData])

  const updateFilter = useCallback((key: keyof FormationFilters, value: FormationFilters[keyof FormationFilters]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
    setData({
      formations: [],
      hasNextPage: true,
      totalCount: 0
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20
    })
    setData({
      formations: [],
      hasNextPage: true,
      totalCount: 0
    })
  }, [])

  return {
    data,
    filtersData,
    isLoading,
    error,
    filters,
    updateFilter,
    resetFilters,
    loadMore,
    refetch: () => fetchFormations()
  }
}