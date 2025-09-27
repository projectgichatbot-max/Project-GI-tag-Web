import { type NextRequest, NextResponse } from "next/server"
import { getDatabaseService } from "@/lib/database-service-fixed"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabaseService()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const region = searchParams.get('region')
    const specialization = searchParams.get('specialization')
    const search = searchParams.get('search')
    const village = searchParams.get('village')
    
    // Build filter object
    const filter: any = {}
    
    if (region && region !== 'all') {
      filter.region = region
    }
    
    if (specialization && specialization !== 'all') {
      filter.specialization = specialization
    }
    
    if (village && village !== 'all') {
      filter.village = village
    }
    
    const pagination = { page, limit }
    
    // Get artisans with pagination
    const result = await db.getArtisans(filter, pagination)
    
    // Handle search separately if provided
    if (search) {
      const searchResults = await db.search(search, 'artisans', limit)
      result.data = searchResults.artisans
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  } catch (error) {
    console.error('Error fetching artisans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artisans' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabaseService()
    const body = await request.json()

    const required = ['name', 'village', 'district', 'region', 'specialization', 'experience', 'bio']
    for (const f of required) {
      if (!body[f]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${f}` }, { status: 400 })
      }
    }

    const newArtisan = await db.createArtisan({
      ...body,
      tags: body.tags || [],
      keywords: body.keywords || [],
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      data: newArtisan,
      message: 'Artisan created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating artisan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create artisan' },
      { status: 500 }
    )
  }
}