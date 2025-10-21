"use client"

import { useState } from "react"
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
import BodyPost from "./body/BodyPost"
import { FilterIcon } from "lucide-react"

export default function PaginationSection() {
  const [page, setPage] = useState(1)
  const limit = 6

  const { data: posts, isLoading, error } =
    trpc.post.getAllPaginated.useQuery({ page, limit })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  if (!posts || posts.length === 0) return <div>No posts found</div>

  return (
    <div className="w-full flex flex-col items-center align-middle justify-center">
      <div className="max-w-7xl w-full flex items-center justify-between mb-6 mx-auto">
        <div className="flex items-center justify-center h-20">
          <h2 className="text-2xl font-bold text-gray-900">All blog Posts</h2>
        </div>
        
        <div className="flex items-center space-x-2">
            <FilterIcon className="w-5 h-5 text-gray-600" />
            <input
                type="text"
                placeholder="Filter by category"
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
        {posts.map((post) => (
           
          <div key={post.id}>
            <BodyPost key={post.id} post={post} />
          </div>
        ))}
      </div>

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
                if (posts.length === limit) setPage((prev) => prev + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
