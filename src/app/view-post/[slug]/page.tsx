"use client"

import { trpc } from "@/lib/trpc"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function ViewPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const { data: post, isLoading, error } = trpc.post.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Post not found</p>
          <Link href="/" className="text-purple-600 hover:text-purple-700">
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-8">
          <span className="mr-2">←</span> Back
        </Link>

        {/* Main Content */}
        <article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8">
          {/* Featured Image */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-120 object-cover rounded-lg mb-8"
            />
          )}

          {/* Header */}
          <header className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {post.author}
              </span>
              <span>•</span>
              <time>
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              {post.updated_at && post.updated_at !== post.created_at && (
                <>
                  <span>•</span>
                  <span>
                    Updated{" "}
                    {new Date(post.updated_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 italic">
              {post.description}
            </p>
          </header>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <footer className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Edit Button */}
              <div className="mt-8">
                <Link
                  href={`/edit-post/${post.slug}`}
                  className="inline-block px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Edit Post
                </Link>
              </div>
            </footer>
          )}
        </article>
      </div>
    </div>
  )
}