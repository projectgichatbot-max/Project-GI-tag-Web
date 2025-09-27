import { type NextRequest, NextResponse } from "next/server"

// Mock data - In production, this would come from MongoDB
const artisans = [
  {
    id: 1,
    name: "Rajesh Negi",
    village: "Munsiyari",
    district: "Pithoragarh",
    region: "Kumaon",
    specialization: "Organic Farming",
    experience: "25 years",
    bio: "Rajesh has been practicing organic farming in the high altitudes of Munsiyari for over two decades. He specializes in growing traditional crops like Rajma and has been instrumental in preserving indigenous seed varieties.",
    image: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
    products: ["Munsiyari Rajma", "Traditional Grains", "Organic Vegetables"],
    skills: ["Organic Farming", "Seed Preservation", "Traditional Agriculture"],
    achievements: [
      "GI Certification for Munsiyari Rajma",
      "Best Organic Farmer Award 2022",
      "Traditional Knowledge Preservation Award",
    ],
    contact: {
      phone: "+91-9876543210",
      email: "rajesh.negi@example.com",
      whatsapp: "+91-9876543210",
    },
    workshopsOffered: [
      {
        title: "Organic Farming Techniques",
        duration: "2 days",
        price: 2500,
        description: "Learn traditional organic farming methods used in high-altitude regions",
      },
      {
        title: "Seed Preservation Workshop",
        duration: "1 day",
        price: 1500,
        description: "Traditional methods of preserving indigenous seeds",
      },
    ],
    availability: "Available for workshops and consultations",
    languages: ["Hindi", "Kumaoni", "English"],
    certifications: ["Organic Farming Certificate", "GI Product Certification"],
  },
  {
    id: 2,
    name: "Meera Bisht",
    village: "Almora",
    district: "Almora",
    region: "Kumaon",
    specialization: "Aipan Art",
    experience: "30 years",
    bio: "Master artist Meera Bisht has dedicated her life to preserving and teaching the sacred art of Aipan. She has trained over 200 students and has her work displayed in cultural centers across India.",
    image: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
    products: ["Aipan Art Pieces", "Traditional Paintings", "Cultural Decorations"],
    skills: ["Aipan Art", "Traditional Painting", "Cultural Education"],
    achievements: [
      "National Award for Traditional Arts",
      "Cultural Heritage Preservation Award",
      "Master Artisan Recognition",
    ],
    contact: {
      phone: "+91-9876543211",
      email: "meera.bisht@example.com",
      whatsapp: "+91-9876543211",
    },
    workshopsOffered: [
      {
        title: "Introduction to Aipan Art",
        duration: "3 days",
        price: 3500,
        description: "Learn the basics of sacred geometric patterns and their meanings",
      },
      {
        title: "Advanced Aipan Techniques",
        duration: "5 days",
        price: 5500,
        description: "Master complex patterns and understand their spiritual significance",
      },
    ],
    availability: "Available for workshops and cultural programs",
    languages: ["Hindi", "Kumaoni", "English"],
    certifications: ["Traditional Arts Master", "Cultural Heritage Expert"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get("specialization")
    const region = searchParams.get("region")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredArtisans = [...artisans]

    // Apply filters
    if (specialization && specialization !== "all") {
      filteredArtisans = filteredArtisans.filter((a) =>
        a.specialization.toLowerCase().includes(specialization.toLowerCase()),
      )
    }

    if (region && region !== "all") {
      filteredArtisans = filteredArtisans.filter((a) => a.region.toLowerCase().includes(region.toLowerCase()))
    }

    if (search) {
      filteredArtisans = filteredArtisans.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.specialization.toLowerCase().includes(search.toLowerCase()) ||
          a.bio.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply pagination
    const paginatedArtisans = filteredArtisans.slice(offset, offset + limit)

    return NextResponse.json({
      artisans: paginatedArtisans,
      total: filteredArtisans.length,
      hasMore: offset + limit < filteredArtisans.length,
    })
  } catch (error) {
    console.error("Error fetching artisans:", error)
    return NextResponse.json({ error: "Failed to fetch artisans" }, { status: 500 })
  }
}
