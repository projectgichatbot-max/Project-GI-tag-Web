import { type NextRequest, NextResponse } from "next/server"
import { getDatabaseService } from "@/lib/database-service-fixed"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabaseService()
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'all', 'products', 'artisans'
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      )
    }
    
    const results = await db.search(query, type || 'all', limit)
    
    return NextResponse.json({
      success: true,
      data: results,
      query,
      total: results.total
    })
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}