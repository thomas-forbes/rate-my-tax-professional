export default {
  dialect: 'postgresql',
  schema: './src/drizzle/schema.ts',
  out: './src/drizzle/migrations/',
  dbCredentials: {
    url: process.env.DB_URL,
  },
}
