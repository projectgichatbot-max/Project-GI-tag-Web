import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import { Artisan } from "@/lib/models/Artisan"
import { Product } from "@/lib/models/Product"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    const type = searchParams.get('type') || 'all' // 'all', 'products', 'artisans'
    const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 10)

    if (!q || q.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    await connectDB()

    // Build regex — escape special chars
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')

    let products: any[] = []
    let artisans: any[] = []

    // ── Search Products ─────────────────────────────────────────────────────
    if (type === 'all' || type === 'products') {
      const productDocs = await Product.find({
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
          { region: regex },
          { 'artisan.name': regex },
          { tags: regex },
          { keywords: regex },
        ],
      })
        .select('name description category region images cloudinaryPublicIds giCertified')
        .limit(limit)
        .lean() as any[]

      products = productDocs.map((p) => ({
        _id: p._id?.toString(),
        name: p.name,
        description: p.description,
        category: p.category,
        region: p.region,
        image: p.images?.[0] || null,
        giCertified: p.giCertified,
      }))
    }

    // ── Search Artisans ─────────────────────────────────────────────────────
    if (type === 'all' || type === 'artisans') {
      const artisanDocs = await Artisan.find({
        $or: [
          { name: regex },
          { specialization: regex },
          { bio: regex },
          { district: regex },
          { village: regex },
          { region: regex },
          { skills: regex },
          { tags: regex },
        ],
      })
        .select('name specialization district village region image')
        .limit(limit)
        .lean() as any[]

      artisans = artisanDocs.map((a) => ({
        _id: a._id?.toString(),
        name: a.name,
        specialization: a.specialization,
        district: a.district,
        village: a.village,
        region: a.region,
        image: a.image || null,
      }))
    }

    return NextResponse.json({
      success: true,
      data: { products, artisans },
      query: q,
      total: products.length + artisans.length,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}