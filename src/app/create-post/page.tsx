"use client"

import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { useRouter } from "next/navigation"

export default function CreatePostPage() {
    const router = useRouter()
    const utils = trpc.useUtils();
  const createPost = trpc.post.create.useMutation({
        onSuccess: async () => {
          await utils.post.getAll.invalidate();
          router.push("/")
        },
  })

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [tags, setTags] = useState("")

 
  const slug = title.trim().toLowerCase().replace(/\s+/g, "-")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createPost.mutate({
      title,
      slug,
      description,
      content,
      author,
      image_url: imageUrl,
      tags: tags.split(",").map((t) => t.trim()),
    })
  }

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Create Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows={3}
          required
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows={6}
          required
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          className="w-full py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors"
        >
          Create Post
        </button>
      </form>
    </div>
  )
}
