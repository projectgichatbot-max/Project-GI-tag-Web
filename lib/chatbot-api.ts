export interface ChatbotResponse {
  response: string
  tag: string | null
  source: "knowledge_base" | "cache" | "web_scrape"
  source_url?: string | null
}

const BACKEND_URL = "http://localhost:8001/chat"

/**
 * Sends a chat query to the Uttarakhand Chatbot backend.
 * Implements client-side timeout and automatic retries with exponential backoff.
 *
 * @param query The question string to send.
 * @param options Configurations for timeout and max retries.
 * @returns A promise resolving to ChatbotResponse.
 */
export async function sendChatQuery(
  query: string,
  options: { timeoutMs?: number; maxRetries?: number } = {}
): Promise<ChatbotResponse> {
  const { timeoutMs = 15000, maxRetries = 3 } = options
  let attempt = 0
  let delay = 1000 // Initial backoff delay (1 second)

  while (attempt < maxRetries) {
    attempt++
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        return await response.json()
      }

      // If server error (5xx), we retry. Otherwise we throw.
      if (response.status >= 500) {
        console.warn(`Chatbot API returned server error ${response.status}. Attempt ${attempt} of ${maxRetries}.`)
        if (attempt >= maxRetries) {
          throw new Error(`Server returned error ${response.status}: ${response.statusText}`)
        }
      } else {
        const errText = await response.text().catch(() => "")
        throw new Error(`API error ${response.status}: ${errText || response.statusText}`)
      }
    } catch (err: any) {
      clearTimeout(timeoutId)

      const isAbort = err.name === "AbortError"
      const isNetwork = err instanceof TypeError // fetch throws TypeError on network issues
      const isServerError = err.message && err.message.includes("Server returned error")

      if ((isAbort || isNetwork || isServerError) && attempt < maxRetries) {
        console.warn(`Chatbot query attempt ${attempt} failed: ${err.message || err}. Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
        continue
      }

      if (isAbort) {
        throw new Error(`Request timed out after ${timeoutMs / 1000} seconds.`)
      }
      throw err
    }
  }

  throw new Error("Chatbot service is currently unreachable.")
}
