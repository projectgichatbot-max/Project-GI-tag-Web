/**
 * lib/translate.ts
 *
 * Language definitions and client-side translation helper.
 * Calls /api/translate (server-side proxy) to avoid CORS.
 *
 * NOTE on Garhwali & Kumauni:
 *   These are regional dialects of Uttarakhand written in Devanagari script.
 *   Google Translate and Web Speech API do not officially support them yet.
 *   We approximate via Hindi (hi/hi-IN) which shares the same script and is
 *   mutually intelligible enough for this use-case. A note is shown in UI.
 */

export interface Language {
  code: string            // Internal identifier used by the app
  translationCode: string // Actual BCP-47 code sent to Google Translate
  voiceCode: string       // BCP-47 code for Web Speech API
  label: string           // Display name (English)
  nativeLabel: string     // Display name in native script
  flag: string            // Emoji flag
  note?: string           // Optional note shown to user (e.g., dialect approximation)
}

export const SUPPORTED_LANGUAGES: Language[] = [
  // ── Standard languages ─────────────────────────────────────────────────
  { code: "en",       translationCode: "en", voiceCode: "en-IN",  label: "English",    nativeLabel: "English",    flag: "🇮🇳" },
  { code: "hi",       translationCode: "hi", voiceCode: "hi-IN",  label: "Hindi",      nativeLabel: "हिन्दी",      flag: "🇮🇳" },
  { code: "mr",       translationCode: "mr", voiceCode: "mr-IN",  label: "Marathi",    nativeLabel: "मराठी",       flag: "🇮🇳" },
  { code: "gu",       translationCode: "gu", voiceCode: "gu-IN",  label: "Gujarati",   nativeLabel: "ગુજરાતી",     flag: "🇮🇳" },
  { code: "bn",       translationCode: "bn", voiceCode: "bn-IN",  label: "Bengali",    nativeLabel: "বাংলা",       flag: "🇮🇳" },
  { code: "pa",       translationCode: "pa", voiceCode: "pa-IN",  label: "Punjabi",    nativeLabel: "ਪੰਜਾਬੀ",      flag: "🇮🇳" },
  { code: "ta",       translationCode: "ta", voiceCode: "ta-IN",  label: "Tamil",      nativeLabel: "தமிழ்",       flag: "🇮🇳" },
  { code: "te",       translationCode: "te", voiceCode: "te-IN",  label: "Telugu",     nativeLabel: "తెలుగు",      flag: "🇮🇳" },
  { code: "kn",       translationCode: "kn", voiceCode: "kn-IN",  label: "Kannada",    nativeLabel: "ಕನ್ನಡ",       flag: "🇮🇳" },
  { code: "ml",       translationCode: "ml", voiceCode: "ml-IN",  label: "Malayalam",  nativeLabel: "മലയാളം",      flag: "🇮🇳" },
  { code: "ur",       translationCode: "ur", voiceCode: "ur-IN",  label: "Urdu",       nativeLabel: "اردو",        flag: "🇵🇰" },
  { code: "or",       translationCode: "or", voiceCode: "or-IN",  label: "Odia",       nativeLabel: "ଓଡ଼ିଆ",       flag: "🇮🇳" },
  // ── Uttarakhand dialects (approximated via Hindi) ──────────────────────
  {
    code: "garhwali",
    translationCode: "hi",  // Google Translate doesn't support Garhwali — using Hindi (Devanagari, mutually intelligible)
    voiceCode: "hi-IN",
    label: "Garhwali",
    nativeLabel: "गढ़वळि",
    flag: "🏔️",
    note: "Approximated via Hindi",
  },
  {
    code: "kumauni",
    translationCode: "hi",  // Google Translate doesn't support Kumauni — using Hindi (Devanagari, mutually intelligible)
    voiceCode: "hi-IN",
    label: "Kumauni",
    nativeLabel: "कुमाउँनी",
    flag: "🏔️",
    note: "Approximated via Hindi",
  },
]

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0] // English

/**
 * Translate text via the server-side /api/translate route.
 * Returns original text on failure so the chat never breaks.
 *
 * @param text   Text to translate
 * @param from   translationCode of source language (e.g. "hi", NOT "garhwali")
 * @param to     translationCode of target language
 */
export async function translateText(
  text: string,
  from: string,
  to: string
): Promise<string> {
  // No-op: same language or empty text
  if (!text.trim() || from === to) return text

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, from, to }),
    })

    if (!res.ok) return text

    const data = await res.json()
    return data.translatedText || text
  } catch {
    // Graceful fallback — never block the chat
    return text
  }
}

/**
 * Returns the Language object for a given language code.
 * Falls back to English if not found.
 */
export function getLanguage(code: string): Language {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? DEFAULT_LANGUAGE
}
