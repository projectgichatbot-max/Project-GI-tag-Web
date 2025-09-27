import { type NextRequest, NextResponse } from "next/server"

// Mock data - In production, this would come from MongoDB
const products = [
  {
    id: 1,
    name: "Munsiyari Rajma",
    category: "Agricultural Products",
    region: "Munsiyari, Pithoragarh",
    description:
      "High-altitude kidney beans rich in protein and minerals, grown in the pristine valleys of Munsiyari at altitudes above 2000 meters.",
    healthBenefits: [
      "High protein content (22-24%)",
      "Rich in iron and potassium",
      "Good for heart health",
      "Helps manage diabetes",
      "High fiber content aids digestion",
    ],
    culturalSignificance:
      "Traditional crop grown in high-altitude regions, essential for mountain communities. These beans have been cultivated for centuries and are integral to local cuisine and festivals.",
    price: 450,
    images: ["/munsiyari-rajma-kidney-beans-red.jpg", "/munsiyari-rajma-kidney-beans-organic-uttarakhand.jpg"],
    inStock: true,
    giCertified: true,
    giRegistrationNumber: "GI-2019-0123",
    artisan: {
      id: 1,
      name: "Rajesh Negi",
      village: "Munsiyari",
      district: "Pithoragarh",
      experience: "25 years",
      specialization: "Organic farming",
      contact: "rajesh.negi@example.com",
      bio: "Rajesh has been practicing organic farming in the high altitudes of Munsiyari for over two decades.",
    },
    nutritionalInfo: {
      protein: "22g per 100g",
      carbohydrates: "60g per 100g",
      fiber: "15g per 100g",
      iron: "8mg per 100g",
      potassium: "1200mg per 100g",
    },
    cookingInstructions: [
      "Soak beans overnight in water",
      "Pressure cook for 15-20 minutes",
      "Season with traditional spices",
      "Best served with rice or roti",
    ],
    seasonality: "Harvested in September-October",
    storageInstructions: "Store in cool, dry place. Use within 12 months.",
    reviews: [
      {
        id: 1,
        user: "Priya Sharma",
        rating: 5,
        comment: "Excellent quality beans with authentic taste. Perfect for traditional recipes.",
        date: "2024-01-10",
      },
      {
        id: 2,
        user: "Amit Kumar",
        rating: 4,
        comment: "Good quality, though slightly expensive. Worth it for the authenticity.",
        date: "2024-01-05",
      },
    ],
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
