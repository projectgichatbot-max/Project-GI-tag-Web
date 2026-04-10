import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, phone, addressHint } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    // Prefer MongoDB `contacts` collection
    const conn = await connectDB()
    if (!conn) {
      const hasMongoUri = Boolean(process.env.MONGODB_URI)
      return NextResponse.json(
        {
          success: false,
          error: hasMongoUri
            ? "MongoDB connection failed. Check Atlas network access, DNS/SRV resolution, and connection string."
            : "MongoDB is not configured. Please set MONGODB_URI to enable contact submissions.",
        },
        { status: 500 }
      )
    }

    const { Contact } = await import("@/lib/models/Contact")
    const saved = await Contact.create({
      name,
      email,
      phone: phone || undefined,
      subject: subject || "General Inquiry",
      message,
      addressHint: addressHint || "Dehradun",
    })


    return NextResponse.json({
      success: true,
      data: {
        id: saved._id,
        status: "received",
        message: "Thank you for your inquiry. We will respond within 24 hours.",
        estimatedResponse: "24 hours",
        ticketNumber: `GI-${saved._id?.toString?.().slice(-6).toUpperCase()}`
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process contact form' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin/listing endpoint for contact messages (MongoDB only)
    const conn = await connectDB()
    if (!conn) {
      const hasMongoUri = Boolean(process.env.MONGODB_URI)
      return NextResponse.json(
        {
          success: false,
          error: hasMongoUri
            ? "MongoDB connection failed. Check Atlas network access, DNS/SRV resolution, and connection string."
            : "MongoDB is not configured.",
        },
        { status: 500 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const { Contact } = await import("@/lib/models/Contact")
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      Contact.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments({}),
    ])
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact messages' },
      { status: 500 }
    )
  }
}