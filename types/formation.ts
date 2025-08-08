import { Formation, Category, Programme, Tag } from '@prisma/client'

export interface FormationWithCategory extends Formation {
  category: Category | null
}

export interface FormationDetailed extends Formation {
  category: Category | null
  programme: Programme[]
  tags: (Tag & {
    category: Category
  })[]
}

export interface FormationFilters {
  search?: string
  niveau?: string
  duree?: string
  format?: string
  budgetMin?: number
  budgetMax?: number
  categoryId?: number
  page?: number
  limit?: number
}

export interface FormationSearchResult {
  formations: FormationWithCategory[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FormationFiltersData {
  niveaux: FilterOption[]
  durees: FilterOption[]
  formats: FilterOption[]
  categories: FilterOption[]
  budgetRange: {
    min: number
    max: number
  }
}