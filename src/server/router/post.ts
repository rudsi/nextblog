import { procedure, router } from "../trpc"
import { z } from "zod"
import { eq, desc } from "drizzle-orm"
import { db } from "@/lib/supabase"
import { posts } from "../db/schema"

export const postRouter = router({
 
    getAll: procedure.query(async () => {
        try {
            const result = await db.select().from(posts).orderBy(desc(posts.created_at))
            console.log("Query successful, returned", result.length, "posts")
            return result
        } catch (error) {
            console.error("getAll query failed:", error instanceof Error ? error.message : error)
            throw error
        }
    }),
    
    getAllPaginated: procedure
    .input(
      z.object({
        page: z.number().min(1),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit
      return await db
        .select()
        .from(posts)
        .orderBy(desc(posts.created_at))
        .limit(input.limit)
        .offset(offset)
    }),

    getBySlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug))
      
      return result[0]
    }),

    create: procedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string(),
        content: z.string(),
        author: z.string(),
        image_url: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(posts).values(input).returning()
      return result[0]
    }),
   
    update: procedure
    .input(
      z.object({
        slug: z.string(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          content: z.string().optional(),
          author: z.string().optional(),
          image_url: z.string().optional(),
          tags: z.array(z.string()).optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db
        .update(posts)
        .set(input.data)
        .where(eq(posts.slug, input.slug))
        .returning()
      
      return result[0]
    }),

    delete: procedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input }) => {
      const result = await db
        .delete(posts)
        .where(eq(posts.slug, input.slug))
        .returning()
      
      return result[0]
    }),
})