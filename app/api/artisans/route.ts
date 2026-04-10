import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import { Artisan } from "@/lib/models/Artisan"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const region = searchParams.get('region')
    const specialization = searchParams.get('specialization')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    // Build filter object
    const filter: any = {}

    if (region && region !== 'all') {
      filter.region = { $regex: region, $options: 'i' }
    }

    if (specialization && specialization !== 'all') {
      filter.specialization = { $regex: specialization, $options: 'i' }
    }

    if (featured === 'true') {
      filter.featured = true
    }

    // Full-text search across key fields
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      filter.$or = [
        { name: searchRegex },
        { bio: searchRegex },
        { specialization: searchRegex },
        { district: searchRegex },
        { village: searchRegex },
        { region: searchRegex },
        { skills: searchRegex },
        { tags: searchRegex },
      ]
    }

    const [artisans, total] = await Promise.all([
      Artisan.find(filter)
        .sort({ featured: -1, rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Artisan.countDocuments(filter),
    ])

    // Serialize MongoDB _id to string
    const serialized = artisans.map((a: any) => ({
      ...a,
      _id: a._id?.toString(),
      products: (a.products || []).map((p: any) => (typeof p === 'object' ? p?.toString() : p)),
    }))

    return NextResponse.json({
      success: true,
      data: serialized,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      }
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
    await connectDB()
    const body = await request.json()

    const required = ['name', 'village', 'district', 'region', 'specialization', 'experience', 'bio']
    for (const f of required) {
      if (!body[f]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${f}` }, { status: 400 })
      }
    }

    const newArtisan = new Artisan({
      ...body,
      tags: body.tags || [],
      keywords: body.keywords || [],
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const saved = await newArtisan.save()

    return NextResponse.json({
      success: true,
      data: { ...saved.toObject(), _id: saved._id.toString() },
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