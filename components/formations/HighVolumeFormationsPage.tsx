'use client'

import { Suspense, useEffect, useState } from 'react'
import { SearchBar } from '@/components/formations/SearchBar'
import { FormationFilters } from '@/components/formations/FormationFilters'
import { VirtualizedFormationsList } from '@/components/formations/VirtualizedFormationsList'
import { useInfiniteFormations } from '@/hooks/useInfiniteFormations'

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex justify-between pt-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const HighVolumeFormationsList = () => {
  const [containerHeight, setContainerHeight] = useState(600)
  
  const {
    data,
    filtersData,
    isLoading,
    error,
    filters,
    updateFilter,
    resetFilters,
    loadMore
  } = useInfiniteFormations()

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight
      const headerHeight = 200
      const availableHeight = vh - headerHeight
      setContainerHeight(Math.max(400, availableHeight))
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">
            Une erreur est survenue lors du chargement des formations. Veuillez réessayer.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Formations</h1>
          <p className="text-lg text-gray-600">
            Découvrez nos formations professionnelles adaptées à vos besoins
          </p>
          <div className="mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
            Mode haute performance activé pour {data.totalCount.toLocaleString('fr-FR')} formations
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FormationFilters
              filters={filters}
              filtersData={filtersData}
              onFilterChange={updateFilter}
              onReset={resetFilters}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <SearchBar
                value={filters.search}
                onSearchChange={(value) => updateFilter('search', value)}
                placeholder="Rechercher par titre, public cible ou prérequis..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span>
                  {data.formations.length.toLocaleString('fr-FR')} formation{data.formations.length > 1 ? 's' : ''} affichée{data.formations.length > 1 ? 's' : ''}
                  {data.totalCount > data.formations.length && (
                    <span> sur {data.totalCount.toLocaleString('fr-FR')} au total</span>
                  )}
                </span>
              </div>
              {isLoading && (
                <div className="flex items-center text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Chargement...
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <VirtualizedFormationsList
                formations={data.formations}
                hasNextPage={data.hasNextPage}
                isLoading={isLoading}
                loadMore={loadMore}
                height={containerHeight}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HighVolumeFormationsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HighVolumeFormationsList />
    </Suspense>
  )
}