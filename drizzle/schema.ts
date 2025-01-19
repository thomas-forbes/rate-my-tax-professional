import { boolean, integer, pgEnum, pgTable, text } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

const db_nanoid = (length?: number) => text().$defaultFn(() => nanoid(length))

export const countries = pgTable('countries', {
  code: text().primaryKey().notNull(), // ISO 3166 alpha-2
  name: text().notNull().default(''),
})

export const professionals = pgTable('professionals', {
  id: db_nanoid(10).primaryKey().unique().notNull(),
  name: text().notNull().default(''),
  credential: text(),
  address: text(),
  country: text().references(() => countries.code),
})

export const complexity = pgEnum('complexity', [
  'simple',
  'moderate',
  'complex',
  'very complex',
])

export const reviews = pgTable('reviews', {
  id: db_nanoid().primaryKey().unique().notNull(),
  professional: text().references(() => professionals.id),
  country: text().references(() => countries.code),

  overallRating: integer().notNull(),
  valueRating: integer().notNull(),

  complexity: complexity().notNull(),

  useAgain: boolean().notNull(),
  comment: text(),
})
