import Postgres from 'postgres'
import 'dotenv/config'

export const sql = Postgres(process.env.DATABASE_URL)


// async function getPostgresVersion() {
//   const response = await sql`select version()`;
//   console.log(response);
// }

// getPostgresVersion();
