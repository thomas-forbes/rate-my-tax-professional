import { and, desc, eq, sql } from 'drizzle-orm'
import { Countries, ProfessionalsWithStats } from '~/drizzle/schema'
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
  limit = 20,
}: SearchParams) {
  'use server'
  const offset = (page - 1) * limit

  const conditions = []
  if (name) {
    conditions.push(sql`${ProfessionalsWithStats.name} % ${name}`)
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

  await db.execute(sql`SELECT set_limit(0.3);`)
  const [results, count] = await Promise.all([
    db
      .select({
        id: ProfessionalsWithStats.id,
        name: ProfessionalsWithStats.name,
        credential: ProfessionalsWithStats.credential,
        address: ProfessionalsWithStats.address,
        country: ProfessionalsWithStats.country,
        fromIrs: ProfessionalsWithStats.fromIrs,
        rating: ProfessionalsWithStats.rating,
        reviewCount: ProfessionalsWithStats.reviewCount,
        useAgainPercent: ProfessionalsWithStats.useAgainPercent,
        countryName: Countries.name,
      })
      .from(ProfessionalsWithStats)
      .where(whereClause)
      .orderBy(desc(sortColumn))
      .leftJoin(Countries, eq(ProfessionalsWithStats.country, Countries.code))
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
