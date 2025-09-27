import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, inquiryType } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // In production, this would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Create support ticket if needed

    console.log("Contact form submission:", {
      name,
      email,
      subject,
      message,
      inquiryType,
      timestamp: new Date().toISOString(),
    })

    // Mock response - in production, integrate with email service
    const response = {
      id: Date.now(),
      status: "received",
      message: "Thank you for your inquiry. We will respond within 24 hours.",
      estimatedResponse: "24 hours",
      ticketNumber: `GI-${Date.now()}`,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Failed to process contact form" }, { status: 500 })
  }
}
