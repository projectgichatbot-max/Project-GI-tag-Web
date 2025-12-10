import { NextResponse } from "next/server"
import { getDatabaseService } from "@/lib/database-service-fixed"

export async function POST(req: Request, context: any) {
  try {
    const id = context?.params?.id
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing product id" }, { status: 400 })
    }

    const body = await req.json()
    const rating = Number(body?.rating)
    const comment = (body?.comment || "").toString().trim()
    const user = (body?.user || "Guest").toString().trim() || "Guest"

    if (!rating || Number.isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    if (!comment) {
      return NextResponse.json({ success: false, error: "Comment is required" }, { status: 400 })
    }

    const db = await getDatabaseService()
    if (!("addProductReview" in db)) {
      return NextResponse.json({ success: false, error: "Ratings not supported" }, { status: 500 })
    }

    const updated = await (db as any).addProductReview(id, { user, rating, comment })
    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("Error adding review:", error)
    return NextResponse.json({ success: false, error: "Failed to add review" }, { status: 500 })
  }
}

