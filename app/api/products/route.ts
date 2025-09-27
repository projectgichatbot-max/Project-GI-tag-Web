import { type NextRequest, NextResponse } from "next/server"

// Mock data - In production, this would come from MongoDB
const products = [
  {
    id: 1,
    name: "Munsiyari Rajma",
    category: "Agricultural Products",
    region: "Munsiyari, Pithoragarh",
    description: "High-altitude kidney beans rich in protein and minerals",
    healthBenefits: ["High protein content", "Rich in iron", "Good for heart health", "Helps manage diabetes"],
    culturalSignificance: "Traditional crop grown in high-altitude regions, essential for mountain communities",
    price: 450,
    image: "/munsiyari-rajma-kidney-beans-red.jpg",
    inStock: true,
    giCertified: true,
    artisan: {
      name: "Rajesh Negi",
      village: "Munsiyari",
      experience: "25 years",
    },
  },
  {
    id: 2,
    name: "Aipan Art Patterns",
    category: "Handicrafts",
    region: "Kumaon Region",
    description: "Sacred geometric art form with spiritual significance",
    healthBenefits: ["Meditative practice", "Stress relief", "Cultural connection"],
    culturalSignificance: "Ancient art form representing cosmic order and spiritual protection",
    price: 1200,
    image: "/aipan-art-traditional-patterns-geometric.jpg",
    inStock: true,
    giCertified: true,
    artisan: {
      name: "Meera Bisht",
      village: "Almora",
      experience: "30 years",
    },
  },
  {
    id: 3,
    name: "Traditional Woolen Caps",
    category: "Textiles",
    region: "Garhwal Region",
    description: "Handwoven winter wear using local sheep wool",
    healthBenefits: ["Natural insulation", "Breathable material", "Hypoallergenic"],
    culturalSignificance: "Traditional winter wear essential for mountain life",
    price: 800,
    image: "/traditional-woolen-caps-coats-uttarakhand-winter-w.jpg",
    inStock: true,
    giCertified: true,
    artisan: {
      name: "Sunita Rawat",
      village: "Chamoli",
      experience: "20 years",
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const region = searchParams.get("region")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredProducts = [...products]

    // Apply filters
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()))
    }

    if (region && region !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.region.toLowerCase().includes(region.toLowerCase()))
    }

    if (search) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.culturalSignificance.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + limit)

    return NextResponse.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      hasMore: offset + limit < filteredProducts.length,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In production, this would save to MongoDB
    const newProduct = {
      id: products.length + 1,
      ...body,
      giCertified: true,
      inStock: true,
    }

    products.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
