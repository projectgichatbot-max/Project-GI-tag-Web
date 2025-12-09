import { type NextRequest, NextResponse } from "next/server"
import { getDatabaseService } from "@/lib/database-service-fixed"

export async function POST(request: NextRequest) {
  try {
  const db = await getDatabaseService()
  const body = await request.json()
    const { name, email, subject, message, inquiryType } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    const savedInquiry: any = await db.createInquiry({
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      inquiryType: inquiryType || 'general',
      status: 'pending',
      priority: 'medium',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    })


    return NextResponse.json({
      success: true,
      data: {
        id: savedInquiry._id,
        status: savedInquiry.status,
        message: "Thank you for your inquiry. We will respond within 24 hours.",
        estimatedResponse: "24 hours",
        ticketNumber: `GI-${savedInquiry._id?.toString?.().slice(-6).toUpperCase()}`
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
  const db = await getDatabaseService()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    
    // Build filter object
    const filter: any = {}
    
    if (status && status !== 'all') {
      filter.status = status
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority
    }
    
  // Get inquiries with pagination via service
    const raw = await db.getInquiries(filter, { page, limit })
    const inquiries = raw.data
    const total = raw.pagination.totalItems
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return NextResponse.json({
      success: true,
      data: inquiries,
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
      { success: false, error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}