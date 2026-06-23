/**
 * app/api/translate/route.ts
 *
 * Server-side proxy for Google Translate (unofficial free endpoints).
 * No API key needed.
 *
 * POST /api/translate
 * Body: { text: string, from: string, to: string }
 * Response: { translatedText: string, detectedLanguage: string }
 *
 * Strategy (split by direction):
 *   • Any lang → English  : client=gtx  (fast, reliable auto-detect, good ASCII output)
 *                           + isPredominantlyLatin guard — rejects native-script leakage
 *   • English → native    : client=webapp + hl=target (proper native script for Gujarati,
 *                           Marathi, Hindi etc.)
 */

import { type NextRequest, NextResponse } from "next/server"

// ── URL builders ────────────────────────────────────────────────────────────

/**
 * client=gtx — best for ANY_LANG → English (auto-detect).
 * Reliable, no token needed, returns proper ASCII English.
 */
function buildGtxUrl(from: string, to: string, text: string): string {
  return (
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx` +
    `&sl=${encodeURIComponent(from)}` +
    `&tl=${encodeURIComponent(to)}` +
    `&ie=UTF-8&oe=UTF-8` +
    `&dt=t` +
    `&q=${encodeURIComponent(text)}`
  )
}

/**
 * client=webapp — best for English → NATIVE_LANG.
 * Returns correct Gujarati / Marathi / Hindi script.
 * hl=target tells the API which script to use for output.
 */
function buildWebappUrl(from: string, to: string, text: string): string {
  return (
    `https://translate.googleapis.com/translate_a/single` +
    `?client=webapp` +
    `&sl=${encodeURIComponent(from)}` +
    `&tl=${encodeURIComponent(to)}` +
    `&hl=${encodeURIComponent(to)}` +    // force native script
    `&ie=UTF-8&oe=UTF-8` +
    `&dt=t` +
    `&q=${encodeURIComponent(text)}`
  )
}

// ── Fetch helpers ────────────────────────────────────────────────────────────

const COMMON_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Referer": "https://translate.google.com/",
}

async function doFetch(url: string): Promise<unknown[] | null> {
  try {
    const res = await fetch(url, {
      headers: COMMON_HEADERS,
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) ? data : null
  } catch {
    return null
  }
}

// ── Response parsers ─────────────────────────────────────────────────────────

function extractText(data: unknown[]): string {
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

function extractDetectedLang(data: unknown[], fallback: string): string {
  return typeof data[2] === "string" ? data[2] : fallback
}

// ── Validation helpers ────────────────────────────────────────────────────────

/**
 * Returns true when text is predominantly Latin characters (i.e., actual English).
 * Catches cases where the translation API returns native script instead of English.
 * - Rejects if >30% chars are non-ASCII (Devanagari, Gujarati script, etc.)
 * - Requires >35% Latin letter proportion
 */
function isPredominantlyLatin(text: string): boolean {
  if (!text || text.length === 0) return false
  const latinChars = (text.match(/[a-zA-Z]/g) ?? []).length
  const nonAscii = (text.match(/[^\x00-\x7F]/g) ?? []).length
  if (nonAscii > text.length * 0.3) return false  // >30% non-ASCII → native script, not English
  return latinChars / text.length > 0.35           // ≥35% Latin letters
}

/**
 * A "failed" translation is one where the API returned either:
 *   (a) an empty string, or
 *   (b) the exact same text as the input (echo-back, meaning it didn't translate)
 */
function isTranslationValid(translated: string, original: string): boolean {
  if (!translated) return false
  const norm = (s: string) => s.replace(/[.,!?।।\s]+$/g, "").trim().toLowerCase()
  return norm(translated) !== norm(original)
}

// ── Main handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const cloned = request.clone()
  let originalText = ""

  try {
    const body = await request.json()
    const { text, from = "auto", to = "en" } = body
    originalText = text ?? ""

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ translatedText: text ?? "", detectedLanguage: from })
    }

    // Same explicit language — no-op (skip when from=auto)
    if (from !== "auto" && from === to) {
      return NextResponse.json({ translatedText: text, detectedLanguage: from })
    }

    const toEnglish = to === "en"
    let translatedText = ""
    let detectedLanguage = from

    // ──────────────────────────────────────────────────────────────────────────
    // PATH A: Translating TO English
    // Three attempts with escalating fallbacks:
    //   1. gtx client (fast, auto-detect)
    //   2. webapp client (backup)
    //   3. gtx with explicit source lang (not "auto")
    // All three are validated with isPredominantlyLatin() to reject native-script leakage.
    // If all fail, returns original text with translationFailed=true so the chatbot
    // can try to match it directly (handles transliterated product names).
    // ──────────────────────────────────────────────────────────────────────────
    if (toEnglish) {
      // Attempt 1: gtx (most reliable for auto-detect)
      const d1 = await doFetch(buildGtxUrl(from, to, text))
      if (d1) {
        const t1 = extractText(d1)
        detectedLanguage = extractDetectedLang(d1, from)
        if (isTranslationValid(t1, text) && isPredominantlyLatin(t1)) {
          translatedText = t1
        }
      }

      // Attempt 2: webapp (backup if gtx returned native script or failed)
      if (!translatedText) {
        const d2 = await doFetch(buildWebappUrl(from, to, text))
        if (d2) {
          const t2 = extractText(d2)
          if (d2[2]) detectedLanguage = extractDetectedLang(d2, from)
          if (isTranslationValid(t2, text) && isPredominantlyLatin(t2)) {
            translatedText = t2
          }
        }
      }

      // Attempt 3: gtx with explicit source language (when auto-detect misidentifies)
      if (!translatedText && from !== "auto") {
        const d3 = await doFetch(buildGtxUrl(from, to, text))
        if (d3) {
          const t3 = extractText(d3)
          if (isPredominantlyLatin(t3)) {
            translatedText = t3
          }
        }
      }

      // All attempts failed — return original so chatbot can handle directly
      // (product names like "tejpatta", "berinag" may work as-is in the chatbot)
      if (!translatedText) {
        return NextResponse.json({
          translatedText: text,
          detectedLanguage,
          translationFailed: true,
        })
      }

      return NextResponse.json({ translatedText, detectedLanguage })
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PATH B: Translating FROM English TO native language
    // webapp gives the correct script (Gujarati gu-IN, Marathi mr-IN, Hindi hi-IN)
    // gtx is the fallback (sometimes returns Devanagari for all Indian langs)
    // ──────────────────────────────────────────────────────────────────────────

    // Attempt 1: webapp (correct script)
    const d1 = await doFetch(buildWebappUrl(from, to, text))
    if (d1) {
      const t1 = extractText(d1)
      detectedLanguage = extractDetectedLang(d1, from)
      if (isTranslationValid(t1, text)) {
        translatedText = t1
      }
    }

    // Attempt 2: gtx fallback
    if (!translatedText) {
      const d2 = await doFetch(buildGtxUrl(from, to, text))
      if (d2) {
        const t2 = extractText(d2)
        if (isTranslationValid(t2, text)) {
          translatedText = t2
        }
      }
    }

    // If both failed, return original
    if (!translatedText) {
      return NextResponse.json({ translatedText: text, detectedLanguage })
    }

    return NextResponse.json({ translatedText, detectedLanguage })

  } catch (error) {
    console.error("[/api/translate] Error:", error)
    if (!originalText) {
      try {
        const fb = await cloned.json()
        originalText = fb?.text ?? ""
      } catch {
        originalText = ""
      }
    }
    return NextResponse.json({ translatedText: originalText, detectedLanguage: "en" })
  }
}

export async function GET() {
  return NextResponse.json({ service: "translate-proxy", status: "ok" })
}
