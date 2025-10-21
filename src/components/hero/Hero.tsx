 "use client"

import MainPost from "./MainPost"
import SidePost from "./SidePost"
import { trpc } from "@/lib/trpc"

export default function Hero() {
  const { data: posts, isLoading, error } = trpc.post.getAll.useQuery()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  if (!posts || posts.length === 0) return <div>No posts found</div>

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const [mostRecentPost, ...otherPosts] = sortedPosts
  const sidePosts = otherPosts.slice(0, 2) // next 2 posts for side

  return (
    <section className="max-w-7xl mx-auto mt-12">
       
      <div className="flex justify-start mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[65vh] gap-8">
        {/* Main Post */}
        <div className="flex flex-col justify-start space-y-6 items-start">
          <MainPost post={mostRecentPost} />
        </div>

        {/* Side Posts */}
        <div className="flex flex-col justify-start space-y-6 items-center">
          {sidePosts.map((post) => (
            <SidePost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
