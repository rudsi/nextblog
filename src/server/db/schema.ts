import { pgTable, text, timestamp, text as textArray, bigserial } from "drizzle-orm/pg-core"

export const posts = pgTable("posts", {
  id: bigserial({mode: "bigint"}).primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  image_url: text("image_url"),
  tags: text("tags").array().default([]),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
})
