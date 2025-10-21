import { procedure, router } from "../trpc"
import { z } from "zod"
import { supabase } from "@/lib/supabase"
import { Post } from "@/types/post"

export const postRouter = router({
 
    getAll: procedure.query(async () => {
        const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false })
        if (error) throw new Error(error.message)
        return data
    }),
    
    getAllPaginated: procedure
    .input(
      z.object({
        page: z.number().min(1),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .range((input.page - 1) * input.limit, input.page * input.limit - 1)

      if (error) throw new Error(error.message)
      return data
    }),

    getBySlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", input.slug)
        .single()

        if (error) throw new Error(error.message)
      return data
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
      const { data, error } = await supabase.from("posts").insert([input]).select()
        if (error) throw new Error(error.message)
        if(!data) throw new Error("Failed to create post")
      return data[0]
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
      const { data, error } = await supabase
        .from("posts")
        .update(input.data)
        .eq("slug", input.slug)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    }),

   delete: procedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from("posts")
        .delete()
        .eq("slug", input.slug)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    }),
})
