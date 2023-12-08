import Postgres from 'postgres'
import 'dotenv/config'

export const sql = Postgres(process.env.DATABASE_URL)

