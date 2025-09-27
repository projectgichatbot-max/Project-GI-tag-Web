import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import { Inquiry } from "@/lib/models/Inquiry"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { name, email, subject, message, inquiryType } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    // Create new inquiry
    const inquiry = new Inquiry({
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

    const savedInquiry = await inquiry.save()

    // In production, you would:
    // 1. Send email notification to admin
    // 2. Send auto-reply to user
    // 3. Create support ticket in external system

    return NextResponse.json({
      success: true,
      data: {
        id: savedInquiry._id,
        status: savedInquiry.status,
        message: "Thank you for your inquiry. We will respond within 24 hours.",
        estimatedResponse: "24 hours",
        ticketNumber: `GI-${savedInquiry._id.toString().slice(-6).toUpperCase()}`
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
    await connectDB()
    
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
    
    // Calculate skip value
    const skip = (page - 1) * limit
    
    // Get inquiries with pagination
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    // Get total count for pagination
    const total = await Inquiry.countDocuments(filter)
    
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