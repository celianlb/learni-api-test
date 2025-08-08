'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function ClientRouter({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    
    // Force router initialization
    router.prefetch('/')
  }, [router])

  if (!isClient) {
    return <>{children}</>
  }

  return <>{children}</>
}