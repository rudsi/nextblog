"use client"

import { useState, useMemo } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { trpc } from "@/lib/trpc"
import BodyPost from "./BodyPost"
import { FilterIcon, X } from "lucide-react"

export default function PaginationSection() {
  const [page, setPage] = useState(1)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilter, setShowFilter] = useState(false)
  const limit = 6

  const { data: allPosts, isLoading, error } = trpc.post.getAll.useQuery()

  const availableTags = useMemo(() => {
    if (!allPosts) return []
    const tags = new Set<string>()
    allPosts.forEach((post) => {
      post.tags?.forEach((tag:string) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [allPosts])

 
  const filteredPosts = useMemo(() => {
    if (!allPosts) return []
    if (selectedTags.length === 0) return allPosts

    return allPosts.filter((post) =>
      selectedTags.some((tag) => post.tags?.includes(tag))
    )
  }, [allPosts, selectedTags])

 
  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * limit
    const end = start + limit
    return filteredPosts.slice(start, end)
  }, [filteredPosts, page])

  const totalPages = Math.ceil(filteredPosts.length / limit)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
    setPage(1)
  }

  const clearFilters = () => {
    setSelectedTags([])
    setPage(1)
    setShowFilter(false)
  }

  if (isLoading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-600">{error.message}</div>
  if (!allPosts || allPosts.length === 0) return <div className="text-center py-10">No posts found</div>

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="max-w-7xl w-full flex items-center justify-between mb-6 mx-auto px-4">
        <div className="flex items-center justify-center h-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All blog Posts</h2>
        </div>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <FilterIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">Filter</span>
        </button>
      </div>

      {showFilter && (
        <div className="max-w-7xl w-full mx-auto px-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter by Tags</h3>
            {selectedTags.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {selectedTags.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Showing {paginatedPosts.length} of {filteredPosts.length} posts
            </p>
          )}
        </div>
      )}

      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl px-4 mb-8">
          {paginatedPosts.map((post) => (
            <div key={post.id}>
              <BodyPost post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 w-full">
          <p className="text-gray-600 dark:text-gray-400">
            No posts found with the selected tags
          </p>
        </div>
      )}
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage((prev) => Math.max(prev - 1, 1))
                }}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                {page}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page < totalPages) setPage((prev) => prev + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
    </div>
  )
}