import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, isVoice } = await request.json()

    const response = {
      message: `I received your ${isVoice ? "voice" : "text"} message: "${message}". This is a placeholder response. In production, this would be processed by Gemini AI.`,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
