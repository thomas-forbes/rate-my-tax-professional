import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  pgView,
  text,
} from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'
import { enumToPgEnum } from '~/lib/funcs'

const db_nanoid = (length?: number) => text().$defaultFn(() => nanoid(length))

export const Countries = pgTable('countries', {
  code: text().primaryKey().notNull(), // ISO 3166 alpha-2
  name: text().notNull().default(''),
})

export const Professionals = pgTable(
  'professionals',
  {
    id: db_nanoid(10).primaryKey().unique().notNull(),
    name: text().notNull().default(''),
    credential: text(),
    address: text(),
    country: text().references(() => Countries.code),
    fromIrs: boolean().notNull().default(false),
  },
  (table) => [index().on(table.country), index().on(table.name)],
)

export const ProfessionalsWithStats = pgView('professionals_with_stats', {
  id: text().notNull(),
  name: text().notNull(),
  credential: text().notNull(),
  address: text().notNull(),
  country: text().notNull(),
  rating: numeric(),
  reviewCount: integer().notNull().default(0),
  useAgainPercent: numeric(),
}).as(
  sql`
    SELECT 
      p.*,
      COALESCE(AVG(r."overallRating")::numeric(10,2), 0) as rating,
      COUNT(r.id) as "reviewCount",
      CASE 
        WHEN COUNT(r.id) > 0 
        THEN (SUM(CASE WHEN r."useAgain" THEN 1 ELSE 0 END)::float / COUNT(r.id) * 100)::numeric(10,2)
        ELSE 0 
      END as "useAgainPercent"
    FROM professionals p
    LEFT JOIN reviews r ON p.id = r."professionalId"
    GROUP BY p.id, p.name, p.credential, p.address, p.country
  `,
)

export enum Complexity {
  Simple = 'simple',
  Moderate = 'moderate',
  Complex = 'complex',
  VeryComplex = 'very complex',
}

export const complexity = pgEnum('complexity', enumToPgEnum(Complexity))

export const Reviews = pgTable(
  'reviews',
  {
    id: db_nanoid().primaryKey().unique().notNull(),
    professionalId: text().references(() => Professionals.id),
    country: text().references(() => Countries.code),

    overallRating: integer().notNull(),
    valueRating: integer().notNull(),

    complexity: complexity().notNull(),

    useAgain: boolean().notNull(),
    comment: text(),
  },
  (table) => [index().on(table.professionalId)],
)

type a = typeof Reviews.$inferInsert
