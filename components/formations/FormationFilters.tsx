'use client'

import { memo, useCallback } from 'react'
import { FormationFilters as FormationFiltersType, FormationFiltersData, FilterOption } from '@/types/formation'

interface FormationFiltersProps {
  filters: FormationFiltersType
  filtersData: FormationFiltersData | null
  onFilterChange: (key: keyof FormationFiltersType, value: FormationFiltersType[keyof FormationFiltersType]) => void
  onReset: () => void
}

const Select = memo(({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  label 
}: {
  value?: string
  onChange: (value?: string) => void
  options: FilterOption[]
  placeholder: string
  label: string
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value === '' ? undefined : e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label} {option.count && `(${option.count})`}
        </option>
      ))}
    </select>
  </div>
))

Select.displayName = 'Select'

const RangeInput = memo(({ 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange, 
  min, 
  max, 
  label 
}: {
  minValue?: number
  maxValue?: number
  onMinChange: (value?: number) => void
  onMaxChange: (value?: number) => void
  min: number
  max: number
  label: string
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex space-x-2">
      <input
        type="number"
        placeholder={`Min (${min}€)`}
        value={minValue || ''}
        onChange={(e) => onMinChange(e.target.value ? parseInt(e.target.value) : undefined)}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <input
        type="number"
        placeholder={`Max (${max}€)`}
        value={maxValue || ''}
        onChange={(e) => onMaxChange(e.target.value ? parseInt(e.target.value) : undefined)}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
))

RangeInput.displayName = 'RangeInput'

export const FormationFilters = memo(({
  filters,
  filtersData,
  onFilterChange,
  onReset
}: FormationFiltersProps) => {
  const handleNiveauChange = useCallback((value?: string) => {
    onFilterChange('niveau', value)
  }, [onFilterChange])

  const handleDureeChange = useCallback((value?: string) => {
    onFilterChange('duree', value)
  }, [onFilterChange])

  const handleFormatChange = useCallback((value?: string) => {
    onFilterChange('format', value)
  }, [onFilterChange])

  const handleCategoryChange = useCallback((value?: string) => {
    onFilterChange('categoryId', value ? parseInt(value) : undefined)
  }, [onFilterChange])

  const handleBudgetMinChange = useCallback((value?: number) => {
    onFilterChange('budgetMin', value)
  }, [onFilterChange])

  const handleBudgetMaxChange = useCallback((value?: number) => {
    onFilterChange('budgetMax', value)
  }, [onFilterChange])

  if (!filtersData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'page' && key !== 'limit' && value !== undefined && value !== null && value !== ''
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <div className="space-y-6">
        <Select
          value={filters.categoryId?.toString()}
          onChange={(value) => handleCategoryChange(value)}
          options={filtersData.categories}
          placeholder="Toutes les catégories"
          label="Catégorie"
        />

        <Select
          value={filters.niveau}
          onChange={handleNiveauChange}
          options={filtersData.niveaux}
          placeholder="Tous les niveaux"
          label="Niveau"
        />

        <Select
          value={filters.duree}
          onChange={handleDureeChange}
          options={filtersData.durees}
          placeholder="Toutes les durées"
          label="Durée"
        />

        <Select
          value={filters.format}
          onChange={handleFormatChange}
          options={filtersData.formats}
          placeholder="Tous les formats"
          label="Format"
        />

        <RangeInput
          minValue={filters.budgetMin}
          maxValue={filters.budgetMax}
          onMinChange={handleBudgetMinChange}
          onMaxChange={handleBudgetMaxChange}
          min={filtersData.budgetRange.min}
          max={filtersData.budgetRange.max}
          label="Budget (€)"
        />
      </div>
    </div>
  )
})

FormationFilters.displayName = 'FormationFilters'