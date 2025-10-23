import { procedure, router } from "../trpc"
import { z } from "zod"
import { eq, desc } from "drizzle-orm"
import { db } from "@/lib/supabase"
import { posts, categories, postsToCategories } from "../db/schema"
import { Post } from "@/types/post"

export const postRouter = router({
  getAll: procedure.query(async () => {
    const rows = await db
      .select({
        post: posts,
        categoryId: postsToCategories.categoryId,
      })
      .from(posts)
      .leftJoin(postsToCategories, eq(posts.id, postsToCategories.postId))
      .orderBy(desc(posts.created_at))

    const postsMap = new Map<string, Post>()

    for (const row of rows) {
      const postId = row.post.id
      if (!postsMap.has(postId)) {
        postsMap.set(postId, {
          id: row.post.id,
          title: row.post.title,
          slug: row.post.slug,
          description: row.post.description,
          content: row.post.content,
          author: row.post.author,
          image_url: row.post.image_url,
          categoryIds: [],
          created_at: row.post.created_at.toISOString(),
          updated_at: row.post.updated_at.toISOString(),
        })
      }
      if (row.categoryId) {
        postsMap.get(postId)!.categoryIds!.push(row.categoryId)
      }
    }

    return Array.from(postsMap.values())
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
      const rows = await db
        .select({
          post: posts,
          categoryId: postsToCategories.categoryId,
        })
        .from(posts)
        .leftJoin(postsToCategories, eq(posts.id, postsToCategories.postId))
        .orderBy(desc(posts.created_at))
        .limit(input.limit)
        .offset(offset)

      const postsMap = new Map<string, Post>()
      for (const row of rows) {
        const postId = row.post.id
        if (!postsMap.has(postId)) {
          postsMap.set(postId, {
            id: row.post.id,
            title: row.post.title,
            slug: row.post.slug,
            description: row.post.description,
            content: row.post.content,
            author: row.post.author,
            image_url: row.post.image_url,
            categoryIds: [],
            created_at: row.post.created_at.toISOString(),
            updated_at: row.post.updated_at.toISOString(),
          })
        }
        if (row.categoryId) {
          postsMap.get(postId)!.categoryIds!.push(row.categoryId)
        }
      }

      return Array.from(postsMap.values())
    }),

  getBySlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const rows = await db
        .select({
          post: posts,
          categoryId: postsToCategories.categoryId,
        })
        .from(posts)
        .leftJoin(postsToCategories, eq(posts.id, postsToCategories.postId))
        .where(eq(posts.slug, input.slug))

      const postsMap = new Map<string, Post>()
      for (const row of rows) {
        const postId = row.post.id
        if (!postsMap.has(postId)) {
          postsMap.set(postId, {
            id: row.post.id,
            title: row.post.title,
            slug: row.post.slug,
            description: row.post.description,
            content: row.post.content,
            author: row.post.author,
            image_url: row.post.image_url,
            categoryIds: [],
            created_at: row.post.created_at.toISOString(),
            updated_at: row.post.updated_at.toISOString(),
          })
        }
        if (row.categoryId) {
          postsMap.get(postId)!.categoryIds!.push(row.categoryId)
        }
      }

      return Array.from(postsMap.values())[0] || null
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
        categoryIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [newPost] = await db
        .insert(posts)
        .values({
          title: input.title,
          slug: input.slug,
          description: input.description,
          content: input.content,
          author: input.author,
          image_url: input.image_url ?? null,
        })
        .returning()

      if (input.categoryIds?.length) {
        const relations = input.categoryIds.map((id) => ({
          postId: newPost.id,
          categoryId: id,
        }))
        await db.insert(postsToCategories).values(relations)
      }

      return {
        ...newPost,
        categoryIds: input.categoryIds || [],
        created_at: newPost.created_at.toISOString(),
        updated_at: newPost.updated_at.toISOString(),
      }
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
          categoryIds: z.array(z.string()).optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const [updatedPost] = await db
        .update(posts)
        .set({
          title: input.data.title,
          description: input.data.description,
          content: input.data.content,
          author: input.data.author,
          image_url: input.data.image_url ?? null,
        })
        .where(eq(posts.slug, input.slug))
        .returning()

      if (input.data.categoryIds) {
        await db
          .delete(postsToCategories)
          .where(eq(postsToCategories.postId, updatedPost.id))

        const relations = input.data.categoryIds.map((id) => ({
          postId: updatedPost.id,
          categoryId: id,
        }))
        await db.insert(postsToCategories).values(relations)
      }

      return {
        ...updatedPost,
        categoryIds: input.data.categoryIds || [],
        created_at: updatedPost.created_at.toISOString(),
        updated_at: updatedPost.updated_at.toISOString(),
      }
    }),

  delete: procedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input }) => {
      const [deletedPost] = await db
        .delete(posts)
        .where(eq(posts.slug, input.slug))
        .returning()

      if (!deletedPost) return null

      return {
        ...deletedPost,
        categoryIds: [],
        created_at: deletedPost.created_at.toISOString(),
        updated_at: deletedPost.updated_at.toISOString(),
      }
    }),

  getByCategory: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const rows = await db
        .select({
          post: posts,
          categoryId: postsToCategories.categoryId,
        })
        .from(posts)
        .innerJoin(postsToCategories, eq(posts.id, postsToCategories.postId))
        .innerJoin(categories, eq(postsToCategories.categoryId, categories.id))
        .where(eq(categories.slug, input.slug))

      const postsMap = new Map<string, Post>()
      for (const row of rows) {
        const postId = row.post.id
        if (!postsMap.has(postId)) {
          postsMap.set(postId, {
            id: row.post.id,
            title: row.post.title,
            slug: row.post.slug,
            description: row.post.description,
            content: row.post.content,
            author: row.post.author,
            image_url: row.post.image_url,
            categoryIds: [],
            created_at: row.post.created_at.toISOString(),
            updated_at: row.post.updated_at.toISOString(),
          })
        }
        if (row.categoryId) {
          postsMap.get(postId)!.categoryIds!.push(row.categoryId)
        }
      }

      return Array.from(postsMap.values())
    }),
})
