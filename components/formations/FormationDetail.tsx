'use client'

import { memo } from 'react'
import Link from 'next/link'
import { FormationDetailed } from '@/types/formation'

interface FormationDetailProps {
  formation: FormationDetailed
}

const InfoItem = memo(({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode
  label: string
  value: string | number 
}) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0 w-5 h-5 text-blue-600">
      {icon}
    </div>
    <div className="flex-1">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className="ml-2 text-gray-900">{value}</span>
    </div>
  </div>
))

InfoItem.displayName = 'InfoItem'

const Section = memo(({ 
  title, 
  children 
}: { 
  title: string
  children: React.ReactNode 
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
    {children}
  </div>
))

Section.displayName = 'Section'

const ObjectivesList = memo(({ objectives }: { objectives: string[] }) => (
  <ul className="space-y-2">
    {objectives.map((objective, index) => (
      <li key={index} className="flex items-start space-x-2">
        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-gray-700">{objective}</span>
      </li>
    ))}
  </ul>
))

ObjectivesList.displayName = 'ObjectivesList'

const ProgrammeTimeline = memo(({ programme }: { programme: FormationDetailed['programme'] }) => (
  <div className="space-y-6">
    {programme.map((jour) => (
      <div key={jour.id} className="relative">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {jour.jour}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{jour.titre}</h3>
            <div className="text-gray-700 whitespace-pre-line">{jour.contenu}</div>
          </div>
        </div>
        {jour.jour < programme.length && (
          <div className="absolute left-5 top-12 w-px h-8 bg-gray-200"></div>
        )}
      </div>
    ))}
  </div>
))

ProgrammeTimeline.displayName = 'ProgrammeTimeline'

export const FormationDetail = memo(({ formation }: FormationDetailProps) => {
  const formatPrice = (price: string, numericPrice?: number | null) => {
    if (numericPrice !== null && numericPrice !== undefined) {
      return `${numericPrice.toLocaleString('fr-FR')}€`
    }
    return price || 'Prix sur demande'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                Accueil
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/formations" className="hover:text-gray-700">
                Formations
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{formation.titre}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* En-tête */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {formation.category && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                  {formation.category.name}
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{formation.titre}</h1>
              
              {/* Tags */}
              {formation.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {formation.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Informations principales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  icon={
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Niveau"
                  value={formation.niveau}
                />
                <InfoItem
                  icon={
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Durée"
                  value={formation.duree}
                />
                <InfoItem
                  icon={
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  label="Format"
                  value={formation.format}
                />
                <InfoItem
                  icon={
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                  label="Participants max"
                  value={formation.participantsMax}
                />
              </div>
            </div>

            {/* Description/Public cible */}
            <Section title="Public cible">
              <p className="text-gray-700 leading-relaxed">{formation.public}</p>
            </Section>

            {/* Objectifs */}
            {formation.objectifs.length > 0 && (
              <Section title="Objectifs pédagogiques">
                <ObjectivesList objectives={formation.objectifs} />
              </Section>
            )}

            {/* Prérequis */}
            <Section title="Prérequis">
              <p className="text-gray-700 leading-relaxed">{formation.prerequis}</p>
            </Section>

            {/* Programme */}
            {formation.programme.length > 0 && (
              <Section title="Programme détaillé">
                <ProgrammeTimeline programme={formation.programme} />
              </Section>
            )}

            {/* Méthodes d'évaluation */}
            {formation.evaluation.length > 0 && (
              <Section title="Méthodes d'évaluation">
                <ul className="space-y-2">
                  {formation.evaluation.map((method, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{method}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Prix et inscription */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPrice(formation.tarifIndividuel, formation.tarifIndividuelNumeric)}
                  </div>
                  <p className="text-sm text-gray-500 mb-6">par personne</p>
                  
                  {formation.tarifCollectif && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">Tarif collectif :</p>
                      <p className="font-semibold text-gray-900">{formation.tarifCollectif}</p>
                    </div>
                  )}
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                    Demander un devis
                  </button>
                </div>
              </div>

              {/* Informations complémentaires */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Code formation :</span>
                    <span className="font-medium">{formation.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Langue :</span>
                    <span className="font-medium">{formation.langue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accompagnement :</span>
                    <span className="font-medium">{formation.accompagnement}</span>
                  </div>
                </div>
              </div>

              {/* Méthodes d'apprentissage */}
              {formation.apprentissage.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Méthodes d'apprentissage</h3>
                  <ul className="space-y-2">
                    {formation.apprentissage.map((method, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

FormationDetail.displayName = 'FormationDetail'