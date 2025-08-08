'use client'

import { memo, useCallback, useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchBarProps {
  value?: string
  onSearchChange: (value?: string) => void
  placeholder?: string
  debounceMs?: number
}

export const SearchBar = memo(({
  value = '',
  onSearchChange,
  placeholder = 'Rechercher une formation...',
  debounceMs = 300
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(value)
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs)

  useEffect(() => {
    setSearchTerm(value)
  }, [value])

  useEffect(() => {
    onSearchChange(debouncedSearchTerm || undefined)
  }, [debouncedSearchTerm, onSearchChange])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setSearchTerm('')
    onSearchChange(undefined)
  }, [onSearchChange])

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        placeholder={placeholder}
      />
      {searchTerm && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            className="h-5 w-5 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
})

SearchBar.displayName = 'SearchBar'