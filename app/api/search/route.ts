import { type NextRequest, NextResponse } from "next/server"

// Mock data for search functionality
const searchData = {
  products: [
    {
      id: 1,
      name: "Munsiyari Rajma",
      type: "product",
      category: "Agricultural Products",
      description: "High-altitude kidney beans rich in protein and minerals",
      keywords: ["rajma", "kidney beans", "protein", "organic", "munsiyari", "health", "traditional"],
    },
    {
      id: 2,
      name: "Aipan Art",
      type: "product",
      category: "Handicrafts",
      description: "Sacred geometric art form with spiritual significance",
      keywords: ["aipan", "art", "geometric", "sacred", "spiritual", "traditional", "patterns"],
    },
  ],
  artisans: [
    {
      id: 1,
      name: "Rajesh Negi",
      type: "artisan",
      specialization: "Organic Farming",
      village: "Munsiyari",
      keywords: ["organic", "farming", "rajma", "traditional", "agriculture", "seeds"],
    },
    {
      id: 2,
      name: "Meera Bisht",
      type: "artisan",
      specialization: "Aipan Art",
      village: "Almora",
      keywords: ["aipan", "art", "traditional", "painting", "cultural", "sacred"],
    },
  ],
  cultural: [
    {
      id: 1,
      title: "Health Benefits of Traditional Foods",
      type: "cultural",
      category: "Health & Nutrition",
      description: "Traditional Uttarakhand foods and their health benefits",
      keywords: ["health", "nutrition", "traditional", "food", "benefits", "organic"],
    },
    {
      id: 2,
      title: "Sacred Geometry in Aipan Art",
      type: "cultural",
      category: "Traditional Arts",
      description: "Understanding the mathematical and spiritual aspects of Aipan",
      keywords: ["aipan", "geometry", "sacred", "spiritual", "mathematics", "art"],
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""
    const type = searchParams.get("type") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!query) {
      return NextResponse.json({
        results: [],
        total: 0,
        suggestions: [
          "Munsiyari Rajma health benefits",
          "Aipan art patterns",
          "Traditional organic farming",
          "GI tagged products Uttarakhand",
        ],
      })
    }

    let results: any[] = []

    // Search products
    if (type === "all" || type === "products") {
      const productResults = searchData.products
        .filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.keywords.some((keyword) => keyword.includes(query)),
        )
        .map((item) => ({ ...item, relevance: calculateRelevance(item, query) }))

      results.push(...productResults)
    }

    // Search artisans
    if (type === "all" || type === "artisans") {
      const artisanResults = searchData.artisans
        .filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.specialization.toLowerCase().includes(query) ||
            item.keywords.some((keyword) => keyword.includes(query)),
        )
        .map((item) => ({ ...item, relevance: calculateRelevance(item, query) }))

      results.push(...artisanResults)
    }

    // Search cultural content
    if (type === "all" || type === "cultural") {
      const culturalResults = searchData.cultural
        .filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.keywords.some((keyword) => keyword.includes(query)),
        )
        .map((item) => ({ ...item, relevance: calculateRelevance(item, query) }))

      results.push(...culturalResults)
    }

    // Sort by relevance and limit results
    results.sort((a, b) => b.relevance - a.relevance)
    results = results.slice(0, limit)

    // Generate suggestions based on query
    const suggestions = generateSuggestions(query)

    return NextResponse.json({
      results,
      total: results.length,
      suggestions,
      query,
    })
  } catch (error) {
    console.error("Error performing search:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

function calculateRelevance(item: any, query: string): number {
  let score = 0
  const queryWords = query.split(" ")

  // Check name/title match
  if (item.name?.toLowerCase().includes(query) || item.title?.toLowerCase().includes(query)) {
    score += 10
  }

  // Check description match
  if (item.description?.toLowerCase().includes(query)) {
    score += 5
  }

  // Check keyword matches
  if (item.keywords) {
    queryWords.forEach((word) => {
      if (item.keywords.some((keyword: string) => keyword.includes(word))) {
        score += 3
      }
    })
  }

  return score
}

function generateSuggestions(query: string): string[] {
  const commonSuggestions = [
    "Munsiyari Rajma health benefits",
    "Aipan art patterns meaning",
    "Traditional organic farming techniques",
    "GI tagged products Uttarakhand",
    "Cultural significance of traditional crafts",
    "Health benefits of mountain foods",
  ]

  // Filter suggestions based on query
  return commonSuggestions.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
}
