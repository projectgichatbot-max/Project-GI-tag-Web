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
    bio: "Rajesh has been practicing organic farming in the high altitudes of Munsiyari for over two decades. He specializes in growing traditional crops like Rajma and has been instrumental in preserving indigenous seed varieties. His farm serves as a model for sustainable agriculture in mountain regions.",
    image: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
    products: ["Munsiyari Rajma", "Traditional Grains", "Organic Vegetables", "Indigenous Seeds"],
    skills: ["Organic Farming", "Seed Preservation", "Traditional Agriculture", "Sustainable Practices"],
    achievements: [
      "GI Certification for Munsiyari Rajma (2019)",
      "Best Organic Farmer Award - Uttarakhand Government (2022)",
      "Traditional Knowledge Preservation Award (2021)",
      "Sustainable Agriculture Excellence Award (2020)",
    ],
    contact: {
      phone: "+91-9876543210",
      email: "rajesh.negi@example.com",
      whatsapp: "+91-9876543210",
      address: "Village Munsiyari, District Pithoragarh, Uttarakhand",
    },
    workshopsOffered: [
      {
        id: 1,
        title: "Organic Farming Techniques",
        duration: "2 days",
        price: 2500,
        description:
          "Learn traditional organic farming methods used in high-altitude regions, including soil preparation, natural fertilizers, and pest management.",
        maxParticipants: 15,
        nextAvailable: "2024-02-15",
      },
      {
        id: 2,
        title: "Seed Preservation Workshop",
        duration: "1 day",
        price: 1500,
        description:
          "Traditional methods of preserving indigenous seeds, storage techniques, and maintaining genetic diversity.",
        maxParticipants: 20,
        nextAvailable: "2024-02-20",
      },
      {
        id: 3,
        title: "Sustainable Mountain Agriculture",
        duration: "3 days",
        price: 4000,
        description: "Comprehensive course on sustainable farming practices adapted for mountain conditions.",
        maxParticipants: 12,
        nextAvailable: "2024-03-01",
      },
    ],
    availability: "Available for workshops and consultations",
    languages: ["Hindi", "Kumaoni", "English"],
    certifications: [
      "Organic Farming Certificate - NPOP",
      "GI Product Certification",
      "Traditional Knowledge Expert - IGNCA",
    ],
    socialImpact: {
      studentsTrained: 150,
      farmersHelped: 75,
      seedVarietiesPreserved: 12,
      organicFarmsEstablished: 25,
    },
    testimonials: [
      {
        id: 1,
        name: "Priya Sharma",
        role: "Agricultural Student",
        comment:
          "Rajesh ji's knowledge of traditional farming is incredible. His workshop changed my perspective on sustainable agriculture.",
        rating: 5,
      },
      {
        id: 2,
        name: "Dr. Amit Kumar",
        role: "Agricultural Researcher",
        comment: "An excellent teacher who combines traditional wisdom with practical knowledge. Highly recommended.",
        rating: 5,
      },
    ],
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const artisanId = Number.parseInt(params.id)
    const artisan = artisans.find((a) => a.id === artisanId)

    if (!artisan) {
      return NextResponse.json({ error: "Artisan not found" }, { status: 404 })
    }

    return NextResponse.json(artisan)
  } catch (error) {
    console.error("Error fetching artisan:", error)
    return NextResponse.json({ error: "Failed to fetch artisan" }, { status: 500 })
  }
}
