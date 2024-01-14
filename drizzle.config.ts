import 'dotenv/config'
import type { Config } from 'drizzle-kit'

const {
  POSTGRES_HOST = "localhost",
  POSTGRES_PORT = 5432,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB
} = process.env

export default {
  schema: './src/schemas',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    host: POSTGRES_HOST,
    port: +POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB!
  },
} satisfies Config
