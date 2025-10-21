import Link from "next/link"
import type { Post } from "../../types/post"

interface SidePostProps {
  post: Post
}

export default function SidePost({ post }: SidePostProps) {
  return (
    <Link href={`/view-post/${post.slug}`}>
      <div className="flex flex-row bg-white rounded-xl overflow-hidden w-full md:w-[90%] cursor-pointer transition-shadow">
        
        <img
          src={post.image_url}
          alt={post.title}
          className="w-1/2 h-64 object-cover rounded-2xl"
        />

         
        <div className="flex-1 flex flex-col justify-start px-3 py-2 gap-2">
          
          <div className="flex items-center text-purple-600 text-xs font-bold mb-1">
            <span>{post.author}</span>
            <span className="w-1 h-1 bg-purple-600 rounded-full mx-1"></span>
            <span>{new Date(post.created_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}</span>
          </div>

          <div className="flex flex-col">
            <div className="text-gray-900 font-bold text-sm truncate">{post.title}</div>
            <div className="flex flex-row text-gray-500 text-xs line-clamp-2">{post.description}</div>
          </div>

    
          <div className="flex flex-wrap gap-1 mt-1">
            {post.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>
      </div>
    </Link>
  )
}