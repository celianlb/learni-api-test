import { Suspense } from 'react'
import Link from 'next/link'
import { FormationsClient } from '@/components/formations/FormationsClient'

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

export default function FormationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Formations</h1>
          <p className="text-lg text-gray-600">
            Découvrez nos formations professionnelles adaptées à vos besoins
          </p>
          {/* Test de navigation simple */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800 mb-2">Test de navigation :</p>
            <Link href="/formations/test-formation" className="text-blue-600 hover:text-blue-800 underline">
              Lien test simple vers /formations/test-formation
            </Link>
          </div>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <FormationsClient />
        </Suspense>
      </div>
    </div>
  )
}