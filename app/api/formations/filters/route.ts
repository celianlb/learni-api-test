import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FormationFiltersData } from '@/types/formation'

export async function GET() {
  try {
    // Récupération des options distinctes avec comptage manuel
    const [
      niveauxData,
      dureesData, 
      formatsData,
      categoriesData,
      budgetData
    ] = await Promise.all([
      // Niveaux
      prisma.$queryRaw<Array<{niveau: string, count: bigint}>>`
        SELECT niveau, COUNT(*) as count 
        FROM "Formation" 
        WHERE niveau IS NOT NULL 
        GROUP BY niveau 
        ORDER BY niveau
      `,
      // Durées
      prisma.$queryRaw<Array<{duree: string, count: bigint}>>`
        SELECT duree, COUNT(*) as count 
        FROM "Formation" 
        WHERE duree IS NOT NULL 
        GROUP BY duree 
        ORDER BY duree
      `,
      // Formats
      prisma.$queryRaw<Array<{format: string, count: bigint}>>`
        SELECT format, COUNT(*) as count 
        FROM "Formation" 
        WHERE format IS NOT NULL 
        GROUP BY format 
        ORDER BY format
      `,
      // Catégories
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              formations: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      }),
      // Budget range
      prisma.formation.aggregate({
        _min: {
          tarifIndividuelNumeric: true
        },
        _max: {
          tarifIndividuelNumeric: true
        },
        where: {
          tarifIndividuelNumeric: {
            not: null
          }
        }
      })
    ])

    const filters: FormationFiltersData = {
      niveaux: niveauxData.map(item => ({
        value: item.niveau,
        label: item.niveau,
        count: Number(item.count)
      })),
      durees: dureesData.map(item => ({
        value: item.duree,
        label: item.duree,
        count: Number(item.count)
      })),
      formats: formatsData.map(item => ({
        value: item.format,
        label: item.format,
        count: Number(item.count)
      })),
      categories: categoriesData.map(category => ({
        value: category.id.toString(),
        label: category.name,
        count: category._count.formations
      })),
      budgetRange: {
        min: budgetData._min.tarifIndividuelNumeric || 0,
        max: budgetData._max.tarifIndividuelNumeric || 10000
      }
    }

    return NextResponse.json(filters)
  } catch (error) {
    console.error('Error fetching filter options:', error)
    
    // En cas d'erreur, retourner des données par défaut
    const defaultFilters: FormationFiltersData = {
      niveaux: [
        { value: 'Débutant', label: 'Débutant', count: 0 },
        { value: 'Intermédiaire', label: 'Intermédiaire', count: 0 },
        { value: 'Avancé', label: 'Avancé', count: 0 }
      ],
      durees: [
        { value: '1 jour', label: '1 jour', count: 0 },
        { value: '2 jours', label: '2 jours', count: 0 },
        { value: '3 jours', label: '3 jours', count: 0 },
        { value: '1 semaine', label: '1 semaine', count: 0 }
      ],
      formats: [
        { value: 'Présentiel', label: 'Présentiel', count: 0 },
        { value: 'Distanciel', label: 'Distanciel', count: 0 },
        { value: 'Hybride', label: 'Hybride', count: 0 }
      ],
      categories: [],
      budgetRange: {
        min: 0,
        max: 5000
      }
    }
    
    return NextResponse.json(defaultFilters)
  }
}