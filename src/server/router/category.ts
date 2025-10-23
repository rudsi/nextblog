import { db } from "@/lib/supabase";
import { procedure, router } from "../trpc";
import { categories } from "../db/schema";
import { z } from "zod";

export const categoryRouter = router({
  getAll: procedure.query(async () => {
    return await db.select().from(categories);
  }),

  create: procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const slug = input.name.trim().toLowerCase().replace(/\s+/g, "-");

      const [newCategory] = await db
        .insert(categories)
        .values({
          name: input.name,
          slug,
        })
        .returning();

      return newCategory;
    }),
});
