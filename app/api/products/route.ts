import { type NextRequest, NextResponse } from "next/server"
import { getDatabaseService } from "@/lib/database-service-fixed"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabaseService()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const region = searchParams.get('region')
    const search = searchParams.get('search')
    const giCertified = searchParams.get('giCertified')
    const available = searchParams.get('available')
    
    // Build filter object
    const filter: any = {}
    
    if (category && category !== 'all') {
      filter.category = category
    }
    
    if (region && region !== 'all') {
      filter.region = region
    }
    
    if (giCertified === 'true') {
      filter.giCertified = true
    }
    
    if (available === 'true') {
      filter.available = true
    }
    
    const pagination = { page, limit }
    
    // Get products with pagination
    const result = await db.getProducts(filter, pagination)
    
    // Handle search separately if provided
    if (search) {
      const searchResults = await db.search(search, 'products', limit)
      result.data = searchResults.products
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabaseService()
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'region', 'description', 'culturalSignificance', 'artisan']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Create new product
    const productData = {
      ...body,
      tags: body.tags || [],
      keywords: body.keywords || []
    }
    
    const savedProduct = await db.createProduct(productData)
    
    return NextResponse.json({
      success: true,
      data: savedProduct,
      message: 'Product created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}