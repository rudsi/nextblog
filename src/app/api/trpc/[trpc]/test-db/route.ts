 
import { db } from "@/lib/supabase"
import { posts } from "@/server/db/schema"

export async function GET() {
  try {
    const result = await db.select().from(posts).limit(1)
    return Response.json({ 
      success: true, 
      message: "Connection works",
      data: result 
    })
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}