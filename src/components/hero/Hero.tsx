"use client"

import { useStore } from "@/lib/store"
import MainPost from "./MainPost"
import SidePost from "./SidePost"

export default function Hero() {
 
  const posts = useStore((state) => state.posts)
  const allCategories = useStore((state) => state.categories)

  if (!posts || posts.length === 0) return <div>No posts found</div>
  if (!allCategories || allCategories.length === 0)
    return <div>Loading categories...</div>

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const [mostRecentPost, ...otherPosts] = sortedPosts
  const sidePosts = otherPosts.slice(0, 2)

  const mainPostWithCategories = {
    ...mostRecentPost,
    categories: (mostRecentPost.categoryIds ?? []).map(
      (id) => allCategories.find((cat) => cat.id === id)?.name || id
    ),
  }

  const sidePostsWithCategories = sidePosts.map((post) => ({
    ...post,
    categories: (post.categoryIds ?? []).map(
      (id) => allCategories.find((cat) => cat.id === id)?.name || id
    ),
  }))

  return (
    <section className="max-w-7xl mx-auto mt-12">
      <div className="flex justify-start mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[65vh] gap-8">
        <div className="flex flex-col justify-start space-y-6 items-start">
          <MainPost post={mainPostWithCategories} />
        </div>
        <div className="flex flex-col justify-start space-y-6 items-center">
          {sidePostsWithCategories.map((post) => (
            <SidePost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
