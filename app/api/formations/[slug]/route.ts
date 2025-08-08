import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const formation = await prisma.formation.findUnique({
      where: {
        slug: params.slug
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

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(formation)
  } catch (error) {
    console.error('Error fetching formation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}