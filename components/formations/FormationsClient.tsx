'use client'

import { SearchBar } from '@/components/formations/SearchBar'
import { FormationFilters } from '@/components/formations/FormationFilters'
import { FormationCard } from '@/components/formations/FormationCard'
import { Pagination } from '@/components/formations/Pagination'
import { useFormations } from '@/hooks/useFormations'

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

const EmptyState = () => (
  <div className="text-center py-12">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune formation trouvée</h3>
    <p className="mt-1 text-sm text-gray-500">
      Essayez de modifier vos critères de recherche ou de filtrage.
    </p>
  </div>
)

export function FormationsClient() {
  const {
    data,
    filtersData,
    isLoading,
    error,
    filters,
    updateFilter,
    resetFilters,
    setPage
  } = useFormations()

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
            {data && (
              <span>
                {data.totalCount} formation{data.totalCount > 1 ? 's' : ''} trouvée{data.totalCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : data?.formations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.formations.map((formation) => (
              <FormationCard
                key={formation.id}
                formation={formation}
              />
            ))}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            hasNextPage={data.hasNextPage}
            hasPreviousPage={data.hasPreviousPage}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  )
}