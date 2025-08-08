import Link from 'next/link'

export default function FormationNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mb-6">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.686-6.266-1.867l-.168-.095a13.05 13.05 0 01-.7-.4 1 1 0 00-1.332.366l-1.8 3.2a1 1 0 001.166 1.508 15.968 15.968 0 007.733 2.013c2.65 0 5.053-.647 7.172-1.797l.283-.153A1 1 0 0020 16.5v-5a4 4 0 00-4-4H8a4 4 0 00-4 4v1a1 1 0 001 1h1a1 1 0 001-1v-1a2 2 0 012-2h8a2 2 0 012 2v5a1 1 0 01-.5.866z"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Formation non trouvée
          </h1>
          
          <p className="text-gray-600 mb-8">
            Désolé, la formation que vous recherchez n'existe pas ou n'est plus disponible.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/formations"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voir toutes les formations
            </Link>
            
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}