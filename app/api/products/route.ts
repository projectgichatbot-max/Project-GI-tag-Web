import { type NextRequest, NextResponse } from "next/server"
import { getDatabaseService } from "@/lib/database-service-fixed"

function buildFallbackRecipes(product: any) {
  const name = product?.name || "Heritage Ingredient"
  const isDrink = /tea|sharbat|juice/i.test(name)
  const isGrain = /rice|millet|dal|beans|gram|lentil|soybean|oil|fruit|spice/i.test(name)

  if (product?.recipes && product.recipes.length) return product.recipes

  if (isDrink) {
    return [
      {
        title: `${name} Refresh`,
        summary: `Traditional beverage using ${name}.`,
        prepTime: "10 mins",
        cookTime: "10 mins",
        serves: "2",
        ingredients: [`2 cups water`, `2 tsp ${name}`, `Honey or jaggery`, `Lemon slice`],
        steps: [
          "Boil water and add the main ingredient.",
          "Steep for 5 minutes and strain.",
          "Sweeten to taste and serve warm.",
        ],
      },
    ]
  }

  if (isGrain) {
    return [
      {
        title: `${name} Pahadi Bowl`,
        summary: `Simple heritage preparation highlighting ${name}.`,
        prepTime: "15 mins",
        cookTime: "25 mins",
        serves: "3-4",
        ingredients: [`1 cup ${name}`, "2 cups water/stock", "1 tsp ghee", "Cumin, turmeric, salt"],
        steps: [
          `Rinse and soak ${name} (if needed) for 20 minutes.`,
          "Temper ghee with cumin and turmeric.",
          "Add the ingredient, then water and salt; simmer till tender.",
          "Rest 5 minutes and serve warm.",
        ],
      },
    ]
  }

  return [
    {
      title: `${name} Showcase`,
      summary: "Cultural presentation to enjoy this heritage item.",
      prepTime: "15 mins",
      cookTime: "30 mins",
      serves: "4",
      ingredients: [name, "Regional herbs/spices", "Local accompaniments"],
      steps: [
        `Feature ${name} as the hero ingredient.`,
        "Prepare a gentle base or platter to highlight its aroma.",
        "Combine and warm carefully without overpowering flavors.",
        "Serve with a short note on its origin and GI story.",
      ],
    },
  ]
}

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

    result.data = result.data.map((item: any) => ({
      ...item,
      recipes: buildFallbackRecipes(item),
    }))
    
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