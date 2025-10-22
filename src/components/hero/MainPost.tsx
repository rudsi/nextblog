"use client"

import Link from "next/link"
import { Post } from "@/types/post"

interface MainPostProps {
  post: Post
}

export default function MainPost({ post }: MainPostProps) {
  return (
    <Link href={`/view-post/${post.slug}`}>
      <div className="px-0 flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer transition-shadow">
        <img
          src={post.image_url || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={post.title}
          className="w-full h-80 md:h-120 object-cover rounded-2xl"
        />

        <div className="px-0 py-3 flex items-center justify-between text-gray-500 text-sm">
          <span className="font-mono text-purple-600 text-xs font-bold flex items-center">
            {post.author}
            <span className="w-1 h-1 bg-purple-600 rounded-full mx-1"></span>
            {new Date(post.created_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="px-0 pb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2">{post.title}</h2>
          <p className="text-sm text-gray-500">{post.description}</p>
        </div>

        <div className="px-0 pb-0 flex flex-wrap gap-2">
          {post.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="font-mono bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}