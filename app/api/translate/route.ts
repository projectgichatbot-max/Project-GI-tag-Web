/**
 * app/api/translate/route.ts
 *
 * Server-side proxy for Google Translate (unofficial free endpoint).
 * Running server-side avoids CORS issues in the browser.
 * No API key needed.
 *
 * POST /api/translate
 * Body: { text: string, from: string, to: string }
 * Response: { translatedText: string, detectedLanguage: string }
 *
 * Uses client=webapp (not gtx) because gtx returns Devanagari transliterations
 * for Gujarati, Punjabi, Urdu, Bengali etc. instead of native script.
 */

import { type NextRequest, NextResponse } from "next/server"

// Primary fetch: client=webapp returns proper native script for all Indic languages
async function fetchTranslation(from: string, to: string, text: string): Promise<Response> {
  // Use webapp client with explicit UTF-8 I/O encoding and hl=target for script hint
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=webapp` +
    `&sl=${encodeURIComponent(from)}` +
    `&tl=${encodeURIComponent(to)}` +
    `&hl=${encodeURIComponent(to)}` +   // UI hint → forces native script output
    `&ie=UTF-8` +
    `&oe=UTF-8` +
    `&dt=t` +                            // translation only (no transliteration noise)
    `&q=${encodeURIComponent(text)}`

  return fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Referer": "https://translate.google.com/",
    },
    signal: AbortSignal.timeout(8000),
  })
}

// Fallback: original gtx client (kept as backup)
async function fetchTranslationFallback(from: string, to: string, text: string): Promise<Response> {
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx` +
    `&sl=${encodeURIComponent(from)}` +
    `&tl=${encodeURIComponent(to)}` +
    `&ie=UTF-8` +
    `&oe=UTF-8` +
    `&dt=t` +
    `&q=${encodeURIComponent(text)}`

  return fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
    },
    signal: AbortSignal.timeout(8000),
  })
}

// Extract translated text from the Google Translate response array
function extractTranslatedText(data: unknown[]): string {
  let result = ""
  const segments = data[0]
  if (Array.isArray(segments)) {
    for (const seg of segments) {
      if (Array.isArray(seg) && typeof seg[0] === "string") {
        result += seg[0]
      }
    }
  }
  return result.trim()
}

// Extract detected source language from response (index 2)
function extractDetectedLang(data: unknown[], fallback: string): string {
  return typeof data[2] === "string" ? data[2] : fallback
}

export async function POST(request: NextRequest) {
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

    // Skip: same language (but always run when from=auto)
    if (from !== "auto" && from === to) {
      return NextResponse.json({ translatedText: text, detectedLanguage: from })
    }

    // ── Primary: client=webapp (proper native script for Gujarati, Urdu, etc.) ──
    let res: Response | null = null
    let data: unknown[] | null = null

    try {
      res = await fetchTranslation(from, to, text)
      if (res.ok) {
        data = await res.json() as unknown[]
      }
    } catch {
      // Primary failed, fall through to fallback
    }

    // ── Fallback: client=gtx ──────────────────────────────────────────────────
    if (!data || !Array.isArray(data)) {
      try {
        res = await fetchTranslationFallback(from, to, text)
        if (res.ok) {
          data = await res.json() as unknown[]
        }
      } catch {
        throw new Error("Both primary and fallback translation failed")
      }
    }

    if (!data || !Array.isArray(data)) {
      throw new Error("Could not parse translation response")
    }

    const translatedText = extractTranslatedText(data)
    const detectedLanguage = extractDetectedLang(data, from)

    // If we got nothing, return original text
    if (!translatedText) {
      return NextResponse.json({ translatedText: text, detectedLanguage })
    }

    return NextResponse.json({
      translatedText,
      detectedLanguage,
    })
  } catch (error) {
    console.error("[/api/translate] Error:", error)
    // Graceful fallback — never block the chat
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
