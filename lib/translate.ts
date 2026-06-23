/**
 * lib/translate.ts
 *
 * Language definitions and client-side translation helper.
 * Calls /api/translate (server-side proxy) to avoid CORS.
 *
 * Supported languages: English · Hindi · Marathi · Gujarati
 * (Bengali → Odia removed; only languages with robust voice + translation support retained)
 */

export interface Language {
  code: string            // Internal identifier used by the app
  translationCode: string // Actual BCP-47 code sent to Google Translate
  voiceCode: string       // BCP-47 code for Web Speech API (recognition + synthesis)
  label: string           // Display name (English)
  nativeLabel: string     // Display name in native script
  flag: string            // Emoji flag
  dir: "ltr" | "rtl"     // Text direction (for input/display)
  /** Preferred voice name substrings for speechSynthesis (ordered by priority) */
  voiceHints: string[]
  /** Example placeholder shown in the chat input when this language is active */
  placeholder: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code:            "en",
    translationCode: "en",
    voiceCode:       "en-IN",
    label:           "English",
    nativeLabel:     "English",
    flag:            "🇮🇳",
    dir:             "ltr",
    voiceHints:      ["Google UK English Female", "Google UK English Male", "Google US English", "en-IN", "en-GB", "en-US"],
    placeholder:     "Ask about Uttarakhand heritage products...",
  },
  {
    code:            "hi",
    translationCode: "hi",
    voiceCode:       "hi-IN",
    label:           "Hindi",
    nativeLabel:     "हिन्दी",
    flag:            "🇮🇳",
    dir:             "ltr",
    voiceHints:      ["Google हिन्दी", "Google Hindi", "hi-IN", "Lekha", "Rishi"],
    placeholder:     "उत्तराखंड के जीआई उत्पादों के बारे में पूछें...",
  },
  {
    code:            "mr",
    translationCode: "mr",
    voiceCode:       "mr-IN",
    label:           "Marathi",
    nativeLabel:     "मराठी",
    flag:            "🇮🇳",
    dir:             "ltr",
    voiceHints:      ["Google मराठी", "Google Marathi", "mr-IN"],
    placeholder:     "उत्तराखंडच्या वारसा उत्पादनांबद्दल विचारा...",
  },
  {
    code:            "gu",
    translationCode: "gu",
    voiceCode:       "gu-IN",
    label:           "Gujarati",
    nativeLabel:     "ગુજરાતી",
    flag:            "🇮🇳",
    dir:             "ltr",
    voiceHints:      ["Google ગુજરાતી", "Google Gujarati", "gu-IN"],
    placeholder:     "ઉત્તરાખંડ ના GI ઉત્પાદનો વિશે પૂછો...",
  },
]

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0] // English

/**
 * Translate text via the server-side /api/translate route.
 * Returns original text on failure so the chat never breaks.
 *
 * @param text   Text to translate
 * @param from   translationCode of source language (e.g. "hi"), or "auto" to auto-detect
 * @param to     translationCode of target language (e.g. "en")
 */
export async function translateText(
  text: string,
  from: string,
  to: string
): Promise<string> {
  // No-op: empty text
  if (!text.trim()) return text

  // No-op: same explicit language (skip for "auto" since we don't know the real source yet)
  if (from !== "auto" && from === to) return text

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

/**
 * Pick the best available speechSynthesis voice for a language.
 * Iterates voiceHints (priority order) and returns the first match.
 * Falls back to the first voice matching the voiceCode prefix.
 */
export function pickVoice(lang: Language): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  // 1. Try each hint string (case-insensitive substring match)
  for (const hint of lang.voiceHints) {
    const match = voices.find(
      (v) =>
        v.name.toLowerCase().includes(hint.toLowerCase()) ||
        v.lang.toLowerCase().startsWith(hint.toLowerCase())
    )
    if (match) return match
  }

  // 2. Fallback: first voice whose lang prefix matches (e.g. "hi" in "hi-IN")
  const prefix = lang.voiceCode.split("-")[0].toLowerCase()
  return voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ?? null
}
