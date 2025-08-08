import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FormationDetail } from '@/components/formations/FormationDetail'
import { FormationDetailed } from '@/types/formation'

interface FormationPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getFormation(slug: string): Promise<FormationDetailed | null> {
  try {
    // Utilisation directe de Prisma côté serveur pour de meilleures performances
    const { prisma } = await import('@/lib/prisma')
    
    const formation = await prisma.formation.findUnique({
      where: {
        slug: slug
      },
      include: {
        category: true,
        programme: {
          orderBy: {
            jour: 'asc'
          }
        },
        tags: {
          include: {
            category: true
          }
        }
      }
    })

    return formation
  } catch (error) {
    console.error('Error fetching formation:', error)
    return null
  }
}

export async function generateMetadata({ params }: FormationPageProps): Promise<Metadata> {
  const { slug } = await params
  const formation = await getFormation(slug)
  
  if (!formation) {
    return {
      title: 'Formation non trouvée',
      description: 'Cette formation n\'existe pas ou n\'est plus disponible.'
    }
  }

  const description = formation.public.length > 160 
    ? formation.public.substring(0, 157) + '...' 
    : formation.public

  return {
    title: `${formation.titre} - Formation ${formation.category?.name || 'Professionnelle'}`,
    description,
    keywords: [
      formation.titre,
      formation.niveau,
      formation.format,
      formation.category?.name,
      ...formation.tags.map(tag => tag.name),
      'formation',
      'apprentissage',
      formation.duree
    ].filter(Boolean).join(', '),
    openGraph: {
      title: formation.titre,
      description,
      type: 'website',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: formation.titre,
      description,
    },
    alternates: {
      canonical: `/formations/${formation.slug}`
    }
  }
}

export default async function FormationPage({ params }: FormationPageProps) {
  const { slug } = await params
  const formation = await getFormation(slug)
  
  if (!formation) {
    notFound()
  }

  return <FormationDetail formation={formation} />
}