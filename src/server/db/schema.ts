import { sql } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core"

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  image_url: text("image_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
})

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
})

export const postsToCategories = pgTable("posts_to_categories", {
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
})