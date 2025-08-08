import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FormationFilters, FormationSearchResult } from '@/types/formation'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const filters: FormationFilters = {
      search: searchParams.get('search') ?? undefined,
      niveau: searchParams.get('niveau') ?? undefined,
      duree: searchParams.get('duree') ?? undefined,
      format: searchParams.get('format') ?? undefined,
      budgetMin: searchParams.get('budgetMin') ? parseInt(searchParams.get('budgetMin')!) : undefined,
      budgetMax: searchParams.get('budgetMax') ? parseInt(searchParams.get('budgetMax')!) : undefined,
      categoryId: searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20')
    }

    const where: Prisma.FormationWhereInput = {}

    if (filters.search) {
      where.OR = [
        {
          titre: {
            contains: filters.search,
            mode: 'insensitive'
          }
        },
        {
          public: {
            contains: filters.search,
            mode: 'insensitive'
          }
        },
        {
          prerequis: {
            contains: filters.search,
            mode: 'insensitive'
          }
        }
      ]
    }

    if (filters.niveau) {
      where.niveau = filters.niveau
    }

    if (filters.duree) {
      where.duree = filters.duree
    }

    if (filters.format) {
      where.format = filters.format
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId
    }

    if (filters.budgetMin !== undefined || filters.budgetMax !== undefined) {
      where.tarifIndividuelNumeric = {}
      
      if (filters.budgetMin !== undefined) {
        where.tarifIndividuelNumeric.gte = filters.budgetMin
      }
      
      if (filters.budgetMax !== undefined) {
        where.tarifIndividuelNumeric.lte = filters.budgetMax
      }
    }

    const skip = ((filters.page || 1) - 1) * (filters.limit || 20)

    const [formations, totalCount] = await Promise.all([
      prisma.formation.findMany({
        where,
        include: {
          category: true
        },
        skip,
        take: filters.limit,
        orderBy: [
          {
            titre: 'asc'
          }
        ]
      }),
      prisma.formation.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / (filters.limit || 20))
    const currentPage = filters.page || 1

    const result: FormationSearchResult = {
      formations,
      totalCount,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching formations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}