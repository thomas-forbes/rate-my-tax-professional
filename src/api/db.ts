import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'

const DB_URL = process.env.DB_URL
if (!DB_URL) throw new Error('DB_URL is not set')

export const db = drizzle({ connection: DB_URL })
