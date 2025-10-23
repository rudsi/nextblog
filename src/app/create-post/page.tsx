"use client"

import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react" // correct icon

export default function CreatePostPage() {
  const router = useRouter()
  const utils = trpc.useUtils()

  const { data: allCategories, refetch: refetchCategories } =
    trpc.category.getAll.useQuery()
  const createCategory = trpc.category.create.useMutation({
    onSuccess: async () => {
      await refetchCategories()
    },
  })

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")

  const createPost = trpc.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate()
      router.push("/")
    },
  })

  const slug = title.trim().toLowerCase().replace(/\s+/g, "-")

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createPost.mutate({
      title,
      slug,
      description,
      content,
      author,
      image_url: imageUrl,
      categoryIds: selectedCategories,
    })
  }

  return (
    <div className="max-w-3xl mx-auto mt-16 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="mr-2 w-4 h-4" /> Back
      </button>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Categories
          </label>

          <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-800 mb-2">
            {allCategories?.map((cat) => (
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
              Selected:{" "}
              {allCategories
                ?.filter((cat) => selectedCategories.includes(cat.id))
                .map((cat) => cat.name)
                .join(", ")}
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
              type="button"
              onClick={handleNewCategory}
              disabled={!newCategoryName.trim() || createCategory.isPending}
            >
              {createCategory.isPending ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="default" disabled={createPost.isPending}>
            {createPost.isPending ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  )
}
