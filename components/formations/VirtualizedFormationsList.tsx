'use client'

import { memo, useCallback, useMemo } from 'react'
import { VariableSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { FormationCard } from './FormationCard'
import { FormationWithCategory } from '@/types/formation'

interface VirtualizedFormationsListProps {
  formations: FormationWithCategory[]
  hasNextPage: boolean
  isLoading: boolean
  loadMore: () => Promise<void>
  height?: number
}

const CARD_HEIGHT = 320
const CARD_SPACING = 24

interface ItemData {
  formations: FormationWithCategory[]
  columnCount: number
}

const Row = memo(({ index, style, data }: {
  index: number
  style: React.CSSProperties
  data: ItemData
}) => {
  const { formations, columnCount } = data
  const startIndex = index * columnCount
  const endIndex = Math.min(startIndex + columnCount, formations.length)
  const rowFormations = formations.slice(startIndex, endIndex)

  return (
    <div style={style} className="flex gap-6 px-4">
      {rowFormations.map((formation, colIndex) => (
        <div
          key={formation.id}
          className="flex-1"
          style={{ minWidth: `calc((100% - ${(columnCount - 1) * CARD_SPACING}px) / ${columnCount})` }}
        >
          <FormationCard formation={formation} />
        </div>
      ))}
      {rowFormations.length < columnCount && (
        Array.from({ length: columnCount - rowFormations.length }).map((_, emptyIndex) => (
          <div key={`empty-${emptyIndex}`} className="flex-1" />
        ))
      )}
    </div>
  )
})

Row.displayName = 'Row'

export const VirtualizedFormationsList = memo(({
  formations,
  hasNextPage,
  isLoading,
  loadMore,
  height = 600
}: VirtualizedFormationsListProps) => {
  const columnCount = useMemo(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      if (width >= 1024) return 2
      return 1
    }
    return 2
  }, [])

  const rowCount = Math.ceil(formations.length / columnCount)
  const itemCount = hasNextPage ? rowCount + 1 : rowCount

  const isItemLoaded = useCallback((index: number) => {
    return index < rowCount
  }, [rowCount])

  const getItemSize = useCallback((index: number) => {
    return CARD_HEIGHT + CARD_SPACING
  }, [])

  const itemData: ItemData = useMemo(() => ({
    formations,
    columnCount
  }), [formations, columnCount])

  const ItemRenderer = useCallback(({ index, style }: {
    index: number
    style: React.CSSProperties
  }) => {
    if (index >= rowCount) {
      return (
        <div style={style} className="flex justify-center items-center">
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          )}
        </div>
      )
    }

    return <Row index={index} style={style} data={itemData} />
  }, [rowCount, isLoading, itemData])

  if (formations.length === 0) {
    return (
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
  }

  return (
    <div className="bg-gray-50">
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMore}
      >
        {({ onItemsRendered, ref }) => (
          <List
            ref={ref}
            height={height}
            itemCount={itemCount}
            itemSize={getItemSize}
            onItemsRendered={onItemsRendered}
            itemData={itemData}
            width="100%"
          >
            {ItemRenderer}
          </List>
        )}
      </InfiniteLoader>
    </div>
  )
})

VirtualizedFormationsList.displayName = 'VirtualizedFormationsList'