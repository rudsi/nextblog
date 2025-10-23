"use client"

import { useEffect } from "react"
import { trpc } from "@/lib/trpc"
import { useStore } from "@/lib/store"

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const { setPosts, setCategories } = useStore()
  const { data: posts } = trpc.post.getAll.useQuery()
  const { data: categories } = trpc.category.getAll.useQuery()

  useEffect(() => {
    if (posts) setPosts(posts)
  }, [posts, setPosts])

useEffect(() => {
    if (categories) {
      const normalized = categories.map((cat) => ({
        ...cat,
        description: cat.description ?? undefined,
      }))
      setCategories(normalized)
    }
  }, [categories, setCategories])

  return <>{children}</>
}
