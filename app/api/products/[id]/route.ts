import { NextResponse } from "next/server"
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
// (Optional) import Cloudinary helpers if/when you add image diff cleanup

// Whitelist of fields allowed to be updated to avoid accidental/hostile overwrite
const ALLOWED_UPDATE_FIELDS = [
  'name',
  'category',
  'region',
  'description',
  'culturalSignificance',
  'tags',
  'images',
  'available',
  'giCertified'
]

function filterUpdatableFields(data: any) {
  if (!data || typeof data !== 'object') return {}
  const clean: Record<string, any> = {}
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (key in data) clean[key] = data[key]
  }
  return clean
}

export async function GET(_req: Request, context: any) {
  try {
    const db = await getDatabaseService()
    const params = await context?.params
    const id = params?.id
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing product id' }, { status: 400 })
    }
    const product = await db.getProductById(id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    product.recipes = buildFallbackRecipes(product)
    if ("getProductReviews" in db && typeof (db as any).getProductReviews === "function") {
      const reviews = await (db as any).getProductReviews(id)
      product.reviews = reviews?.map((r: any) => ({
        id: r._id?.toString?.() || r.id,
        user: r.user,
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt || r.date,
      }))
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const id = context?.params?.id
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing product id' }, { status: 400 })
    }

    // Safer JSON parse with 400 feedback
    let incoming: any
    try {
      incoming = await req.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }

    const db = await getDatabaseService()
    const existing = await db.getProductById(id)
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const filtered = filterUpdatableFields(incoming)
    if (Object.keys(filtered).length === 0) {
      return NextResponse.json({ success: false, error: 'No valid updatable fields provided' }, { status: 400 })
    }

    // (Optional) Compare existing.images vs filtered.images and delete removed Cloudinary assets here
    const updatedProduct = await db.updateProduct(id, { ...filtered, updatedAt: new Date() })
    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: Request, context: any) {
  try {
    const id = context?.params?.id
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing product id' }, { status: 400 })
    }
    const db = await getDatabaseService()
    const existing = await db.getProductById(id)
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }
    // (Optional) Image cleanup via Cloudinary if you maintain public IDs
    await db.deleteProduct(id)
    return NextResponse.json({
      success: true,
      data: { id },
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}