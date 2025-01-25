import { and, desc, eq, ilike, sql } from 'drizzle-orm'
import { ProfessionalsWithStats } from '~/drizzle/schema'
import { db } from '../db'

export type SortOption = {
  value: SearchParams['sort']
  label: string
}

export type SearchParams = {
  name?: string
  country?: string
  sort?: 'rating' | 'value' | 'wouldUseAgain'
  page?: number
  limit?: number
}

export async function searchProfessionals({
  name,
  country,
  sort = 'rating',
  page = 1,
  limit = 10,
}: SearchParams) {
  'use server'
  const offset = (page - 1) * limit

  const conditions = []
  if (name) {
    conditions.push(ilike(ProfessionalsWithStats.name, `%${name}%`))
  }
  if (country) {
    conditions.push(eq(ProfessionalsWithStats.country, country))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const sortColumn =
    sort === 'value'
      ? ProfessionalsWithStats.rating
      : sort === 'wouldUseAgain'
      ? ProfessionalsWithStats.useAgainPercent
      : ProfessionalsWithStats.rating

  const [results, count] = await Promise.all([
    db
      .select()
      .from(ProfessionalsWithStats)
      .where(whereClause)
      .orderBy(desc(sortColumn))
      .limit(limit)
      .offset(offset),
    await db
      .select({ count: sql<number>`count(*)` })
      .from(ProfessionalsWithStats)
      .where(whereClause)
      .then((result) => Number(result[0].count)),
  ])

  return {
    professionals: results,
    pagination: {
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      limit,
    },
  }
}
