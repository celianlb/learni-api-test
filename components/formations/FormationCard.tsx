'use client'

import { memo } from 'react'
import Link from 'next/link'
import { FormationWithCategory } from '@/types/formation'

interface FormationCardProps {
  formation: FormationWithCategory
}

export const FormationCard = memo(({ formation }: FormationCardProps) => {
  const formatPrice = (price: string, numericPrice?: number | null) => {
    if (numericPrice !== null && numericPrice !== undefined) {
      return `${numericPrice.toLocaleString('fr-FR')}€`
    }
    return price || 'Prix sur demande'
  }

  return (
    <Link 
      href={`/formations/${formation.slug}`}
      className="block group"
      prefetch={true}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden h-full">
        <div className="p-6">
          {formation.category && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
              {formation.category.name}
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {formation.titre}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Niveau:</span>
              <span className="ml-1">{formation.niveau}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Durée:</span>
              <span className="ml-1">{formation.duree}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Format:</span>
              <span className="ml-1">{formation.format}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium">Participants:</span>
              <span className="ml-1">{formation.participantsMax} max</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-xl font-bold text-blue-600">
              {formatPrice(formation.tarifIndividuel, formation.tarifIndividuelNumeric)}
            </div>
            <div className="text-sm text-gray-500">
              par personne
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}, (prevProps, nextProps) => {
  return prevProps.formation.id === nextProps.formation.id &&
         prevProps.formation.titre === nextProps.formation.titre &&
         prevProps.formation.tarifIndividuelNumeric === nextProps.formation.tarifIndividuelNumeric
})

FormationCard.displayName = 'FormationCard'