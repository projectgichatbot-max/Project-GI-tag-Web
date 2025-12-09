import { type NextRequest, NextResponse } from "next/server"
import { getDatabaseService } from "@/lib/database-service-fixed"

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabaseService()
    const body = await request.json()
    const { email, source } = body

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Get client IP and user agent for metadata
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create newsletter subscriber
    const subscriber = await db.createNewsletterSubscriber({
      email,
      source: source || 'footer',
      status: 'active',
      metadata: {
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        userAgent
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: subscriber._id || subscriber.id,
        email: subscriber.email,
        status: subscriber.status,
        message: "Thank you for subscribing to our newsletter!"
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error processing newsletter subscription:', error)
    
    // Handle duplicate email error
    if (error.code === 11000 || error.message?.includes('duplicate')) {
      return NextResponse.json(
        { success: false, error: "This email is already subscribed" },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to process newsletter subscription' },
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
    
    // Build filter object
    const filter: any = {}
    
    if (status && status !== 'all') {
      filter.status = status
    }
    
    // Get subscribers with pagination via service
    const raw = await db.getNewsletterSubscribers(filter, { page, limit })
    const subscribers = raw.data
    const total = raw.pagination.totalItems
    
    return NextResponse.json({
      success: true,
      data: subscribers,
      pagination: raw.pagination
    })
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsletter subscribers' },
      { status: 500 }
    )
  }
}

