import { router } from "../trpc";
import { postRouter } from "./post";

console.log('postRouter in _app.ts:', postRouter)

export const appRouter = router({
    post: postRouter,
})

console.log('appRouter created:', appRouter)

export type AppRouter = typeof appRouter;