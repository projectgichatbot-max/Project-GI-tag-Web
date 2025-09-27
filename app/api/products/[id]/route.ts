import { NextResponse } from "next/server"
import { getDatabaseService } from "@/lib/database-service-fixed"
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
    const id = context?.params?.id
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