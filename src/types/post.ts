export type Post = {
  id: number
  title: string
  slug: string
  description: string
  content: string
  author: string
  image_url: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}
