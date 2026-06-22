/**
 * app/api/translate/route.ts
 *
 * Server-side proxy for Google Translate (free endpoint).
 * Running server-side avoids CORS issues in the browser.
 * No API key needed — uses the public gtx client.
 *
 * POST /api/translate
 * Body: { text: string, from: string, to: string }
 * Response: { translatedText: string, detectedLanguage: string }
 */

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // Clone BEFORE consuming the body — needed for fallback in catch block
  const cloned = request.clone()
  let originalText = ""

  try {
    const body = await request.json()
    const { text, from = "auto", to = "en" } = body
    originalText = text ?? ""

    // Guard: empty text
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ translatedText: text ?? "", detectedLanguage: from })
    }

    // Skip: same source and target language
    if (from !== "auto" && from === to) {
      return NextResponse.json({ translatedText: text, detectedLanguage: from })
    }

    // Build URL manually — URLSearchParams doesn't support duplicate keys (dt=t&dt=ld)
    const rawUrl =
      `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx` +
      `&sl=${encodeURIComponent(from)}` +
      `&tl=${encodeURIComponent(to)}` +
      `&dt=t&dt=ld` +
      `&q=${encodeURIComponent(text)}`

    const res = await fetch(rawUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
      },
    })

    if (!res.ok) {
      throw new Error(`Google Translate returned HTTP ${res.status}`)
    }

    // Response structure:
    // [
    //   [["translatedSegment","originalSegment",null,null,1], ...],
    //   null,
    //   "detectedLangCode",
    //   ...
    // ]
    const data = await res.json()

    // Extract all translated segments and join
    let translatedText = ""
    if (Array.isArray(data[0])) {
      for (const segment of data[0]) {
        if (segment && typeof segment[0] === "string") {
          translatedText += segment[0]
        }
      }
    }

    // Extract detected language (index 2 in the response array)
    const detectedLanguage: string = typeof data[2] === "string" ? data[2] : from

    // If we got nothing, return original
    if (!translatedText.trim()) {
      return NextResponse.json({ translatedText: text, detectedLanguage })
    }

    return NextResponse.json({
      translatedText: translatedText.trim(),
      detectedLanguage,
    })
  } catch (error) {
    console.error("[/api/translate] Error:", error)
    // Graceful fallback — use originalText captured before body was consumed
    // If that failed too, try to read from the clone
    if (!originalText) {
      try {
        const fb = await cloned.json()
        originalText = fb?.text ?? ""
      } catch {
        originalText = ""
      }
    }
    return NextResponse.json({
      translatedText: originalText,
      detectedLanguage: "en",
    })
  }
}

export async function GET() {
  return NextResponse.json({ service: "translate-proxy", status: "ok" })
}
