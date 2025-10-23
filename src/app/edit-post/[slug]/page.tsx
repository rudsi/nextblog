"use client"

import { useState, useEffect } from "react"
import { trpc } from "@/lib/trpc"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const utils = trpc.useUtils()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [loading, setLoading] = useState(true)

  const { data: post } = trpc.post.getBySlug.useQuery({ slug }, { enabled: !!slug })
  const { data: allCategories, refetch: refetchCategories } = trpc.category.getAll.useQuery()
  const updatePost = trpc.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate()
      router.push("/")
    },
  })
  const deletePost = trpc.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate()
      router.push("/")
    },
  })
  const createCategory = trpc.category.create.useMutation({
    onSuccess: async () => {
      await refetchCategories()
    },
  })

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setDescription(post.description)
      setContent(post.content)
      setAuthor(post.author)
      setImageUrl(post.image_url || "")
      setSelectedCategories(post.categoryIds || [])
      setLoading(false)
    }
  }, [post])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updatePost.mutate({
      slug,
      data: {
        title: title !== post?.title ? title : undefined,
        description: description !== post?.description ? description : undefined,
        content: content !== post?.content ? content : undefined,
        author: author !== post?.author ? author : undefined,
        image_url: imageUrl !== post?.image_url ? imageUrl : undefined,
        categoryIds:
          JSON.stringify(selectedCategories) !== JSON.stringify(post?.categoryIds)
            ? selectedCategories
            : undefined,
      },
    })
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost.mutate({ slug })
    }
  }

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleNewCategory = async () => {
    if (!newCategoryName.trim()) return
    const created = await createCategory.mutateAsync({ name: newCategoryName })
    if (created?.id) {
      setSelectedCategories((prev) => [...prev, created.id])
      setNewCategoryName("")
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-gray-600 dark:text-gray-400">Loading...</div>
    </div>
  )

  if (!post) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 mb-4">Post not found</p>
        <Link href="/" className="text-purple-600 hover:text-purple-700">Go back home</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-8">
          <span className="mr-2">←</span> Back
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-800 mb-2">
                {allCategories?.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryToggle(cat.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategories.includes(cat.id)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Selected: {allCategories?.filter(cat => selectedCategories.includes(cat.id)).map(cat => cat.name).join(", ")}
                </p>
              )}

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <Button
                  variant="default"
                  onClick={handleNewCategory}
                  disabled={!newCategoryName.trim() || createCategory.isPending}
                >
                  {createCategory.isPending ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button variant="default" disabled={updatePost.isPending}>
                {updatePost.isPending ? "Updating..." : "Update Post"}
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={deletePost.isPending}>
                {deletePost.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
