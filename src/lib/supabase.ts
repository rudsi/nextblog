import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const dbUrl = process.env.DATABASE_URL

if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set")
}

console.log("Connecting to database with URL provided")

const client = postgres(dbUrl, {
  ssl: "require",
  max: 1,
})

export const db = drizzle(client)