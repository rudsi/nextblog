export type Post = {
  id: string
  title: string
  slug: string
  description: string
  content: string
  author: string
  image_url: string | null
  categoryIds?: string[] | null
  created_at: string
  updated_at: string
}

export type PostWithCategories = {
  post: Post
  categoryIds: string[]
}

