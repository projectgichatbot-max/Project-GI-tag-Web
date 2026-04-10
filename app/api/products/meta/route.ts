import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import { allGIProducts } from "@/lib/gi-products-complete"

export async function GET() {
  try {
    const conn = await connectDB()

    let categories: string[] = []
    let regions: string[] = []

    if (conn) {
      const { Product } = await import("@/lib/models/Product")
      categories = (await Product.distinct("category")) as string[]
      regions = (await Product.distinct("region")) as string[]
    } else {
      categories = Array.from(new Set(allGIProducts.map((p) => p.category)))
      regions = Array.from(new Set(allGIProducts.map((p) => p.region)))
    }

    categories = categories.filter(Boolean).sort((a, b) => a.localeCompare(b))
    regions = regions.filter(Boolean).sort((a, b) => a.localeCompare(b))

    return NextResponse.json({
      success: true,
      data: {
        categories: ["All", ...categories],
        regions: ["All", ...regions],
      },
    })
  } catch (error) {
    console.error("Error building products meta:", error)
    return NextResponse.json(
      { success: false, error: "Failed to build products meta" },
      { status: 500 }
    )
  }
}

