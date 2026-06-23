/**
 * lib/chatbot-api.ts
 *
 * Client-side helper that calls the Next.js /api/ai-chat route.
 * Works on localhost AND on Vercel — no Python server needed.
 */

export interface ChatbotResponse {
  response: string
  tag: string | null
  source: "knowledge_base" | "cache" | "web_scrape"
  source_url?: string | null
}

// Always use a relative URL so it works on localhost AND on Vercel
const CHAT_ENDPOINT = "/api/ai-chat"

/**
 * Sends a chat query to the Next.js AI chat API route.
 * Implements client-side timeout and automatic retries with exponential backoff.
 *
 * @param query           The query text (in English, after translation).
 * @param originalNative  The user's original text before translation (if any).
 *                        Passed to the backend so it can fall back when the
 *                        translated text is not valid English.
 */
export async function sendChatQuery(
  query: string,
  options: { timeoutMs?: number; maxRetries?: number; originalNative?: string } = {}
): Promise<ChatbotResponse> {
  const { timeoutMs = 15000, maxRetries = 3, originalNative } = options
  let attempt = 0
  let delay = 1000

  while (attempt < maxRetries) {
    attempt++
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          ...(originalNative ? { originalNative } : {}),
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const json = await response.json()

        // Our /api/ai-chat route returns: { success, data: { message, tag, ... } }
        // Map it to the ChatbotResponse shape the chat page expects
        if (json.success && json.data) {
          return {
            response: json.data.message,
            tag: json.data.tag ?? null,
            // ✅ Read actual source + source_url from server (not hardcoded)
            source: json.data.source || "knowledge_base",
            source_url: json.data.source_url ?? null,
          }
        }

        // Fallback — direct shape (shouldn't happen but just in case)
        if (json.response) return json as ChatbotResponse

        throw new Error(json.error || "Unexpected response format")
      }

      if (response.status >= 500) {
        console.warn(`Chatbot API server error ${response.status}. Attempt ${attempt}/${maxRetries}.`)
        if (attempt >= maxRetries) {
          throw new Error(`Server error ${response.status}: ${response.statusText}`)
        }
      } else {
        const errText = await response.text().catch(() => "")
        throw new Error(`API error ${response.status}: ${errText || response.statusText}`)
      }
    } catch (err: any) {
      clearTimeout(timeoutId)

      const isAbort = err.name === "AbortError"
      const isNetwork = err instanceof TypeError
      const isServerError = err.message?.includes("Server error")

      if ((isAbort || isNetwork || isServerError) && attempt < maxRetries) {
        console.warn(`Chatbot query attempt ${attempt} failed: ${err.message}. Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2
        continue
      }

      if (isAbort) throw new Error(`Request timed out after ${timeoutMs / 1000}s.`)
      throw err
    }
  }

  throw new Error("Chatbot service is currently unreachable.")
}
