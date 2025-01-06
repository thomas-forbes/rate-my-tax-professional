import { query } from '@solidjs/router'
import { desc } from 'drizzle-orm'
import { db } from '~/api/db'
import { CountriesWithStats } from '~/drizzle/schema'

export const getCountries = query(async () => {
  'use server'
  return await db
    .select()
    .from(CountriesWithStats)
    .orderBy(desc(CountriesWithStats.numberOfProfessionals))
}, 'countries')
