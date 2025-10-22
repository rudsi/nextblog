import { drizzle } from "drizzle-orm/node-postgres"
import {Pool} from "pg"

 

 

console.log("Connecting to database with URL provided")

const pool = new Pool({
  connectionString:process.env.DATABASE_URL!
}
)

export const db = drizzle(pool)