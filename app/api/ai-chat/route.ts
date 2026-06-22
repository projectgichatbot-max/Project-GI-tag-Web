import { type NextRequest, NextResponse } from "next/server"
import Fuse from "fuse.js"
import GI_PRODUCTS_RAW from "@/uttarakhand_chatbot/data/master_gi_dataset.json"

interface GIRecord {
  name: string
  category: string
  region: string
  description: string
  uses: string[]
  examples: string[]
  ingredients: string[]
  recipe: string[]
  registration: string
  recipe_title: string
  recipe_description: string
}

const products = GI_PRODUCTS_RAW as GIRecord[]

interface CacheEntry {
  response: string
  tag: string | null
  timestamp: number
}

const responseCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

function cacheGet(key: string): CacheEntry | null {
  const entry = responseCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key)
    return null
  }
  return entry
}

function cacheSet(key: string, response: string, tag: string | null): void {
  responseCache.set(key, { response, tag, timestamp: Date.now() })
}

const FILLER_PREFIXES = [
  "can you tell me about ",
  "give me information on ",
  "traditional recipe of ",
  "steps to prepare ",
  "information about ",
  "give details of ",
  "steps to make ",
  "dishes made with ",
  "dishes using ",
  "food made using ",
  "food made with ",
  "ingredients of ",
  "details about ",
  "info about ",
  "details of ",
  "tell me of ",
  "info on ",
  "information on ",
  "details on ",
  "query about ",
  "query for ",
  "recipe of ",
  "recipe for ",
  "recepie of ",
  "recepie for ",
  "recipie of ",
  "recipie for ",
  "how to use ",
  "how to cook ",
  "how can i ",
  "how about ",
  "tell about ",
  "how is ",
  "how are ",
  "how do you ",
  "how to ",
  "how can ",
  "steps to ",
  "tell me about ",
  "what is ",
  "what are ",
  "describe ",
  "show me ",
]

function cleanFillerWords(query: string): string {
  let q = query.toLowerCase().replace(/[^\w\s]/g, "").trim()
  for (const prefix of FILLER_PREFIXES) {
    if (q.startsWith(prefix)) {
      q = q.slice(prefix.length).trim()
      break
    }
  }
  return q
    .replace(/\s+be\s+used\s+in\s+cooking$/, "")
    .replace(/\s+used\s+in\s+cooking$/, "")
    .replace(/\s+in\s+cooking$/, "")
    .replace(/\s+made$/, "")
    .replace(/\s+prepared$/, "")
    .replace(/\s+please$/, "")
    .replace(/\s+thanks$/, "")
    .trim()
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Name aliases (mirrors _get_match_candidates in intent_detector.py)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getMatchCandidates(name: string): string[] {
  const n = name.toLowerCase()
  const candidates: string[] = [n]

  if (n.startsWith("uttarakhand ")) {
    candidates.push(n.slice("uttarakhand ".length).trim())
  }

  const parenMatches = n.match(/\(([^)]+)\)/g) || []
  for (const m of parenMatches) {
    candidates.push(m.replace(/[()]/g, "").trim())
  }
  const noParens = n.replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim()
  candidates.push(noParens)
  if (noParens.startsWith("uttarakhand ")) {
    candidates.push(noParens.slice("uttarakhand ".length).trim())
  }

  if (n.includes("tejpat")) candidates.push("tejpatta", "tej patta", "tejpat", "tej pata")
  if (n.includes("ringaal") || n.includes("ringal")) candidates.push("ringal craft", "ringal", "ringaal")
  if (n.includes("bal mithai") || n.includes("bal mitai")) candidates.push("bal mitai", "bal mithai")
  if (n.includes("munsyari") || n.includes("munsiyari")) candidates.push("munsiyari rajma", "munsyari rajma", "munsiyari", "mungsiyari rajma")
  if (n.includes("bichhu") || n.includes("bichu")) candidates.push("bichhu buti", "bichu buti", "nettle fabric")
  if (n.includes("lakhori")) candidates.push("lakhori mirchi", "lakhori")
  if (n.includes("berinag")) candidates.push("berinag tea", "berinag")
  if (n.includes("chiura") || n.includes("chyura")) candidates.push("chiura", "chyura", "chiura oil", "chyura oil")
  if (n.includes("tamta")) candidates.push("copper products", "tamta craft", "tamta")
  if (n.includes("pichhoda") || n.includes("pichora")) candidates.push("pichhoda", "pichora", "rangwali pichora")
  if (n.includes("mombatti") || n.includes("candle")) candidates.push("candle", "nainital mombatti", "mombatti")
  if (n.includes("likhai")) candidates.push("likhai", "wood carving")

  return [...new Set(candidates)]
}

function fuseScore(query: string, candidate: string): number {
  const f = new Fuse([{ name: candidate }], {
    keys: ["name"],
    threshold: 1.0,
    includeScore: true,
    ignoreLocation: true,
  })
  const results = f.search(query)
  if (!results.length) return 0
  return (1 - (results[0].score ?? 1)) * 100
}

function fuzzyMatchProduct(query: string): { record: GIRecord; score: number } | null {
  const cleaned = cleanFillerWords(query)
  if (!cleaned) return null

  let bestScore = 0
  let bestRecord: GIRecord | null = null

  for (const product of products) {
    const candidates = getMatchCandidates(product.name)
    for (const candidate of candidates) {
      const score = Math.max(
        fuseScore(cleaned, candidate),
        fuseScore(query, candidate)
      )
      if (score > bestScore) {
        bestScore = score
        bestRecord = product
      }
    }
  }

  return bestScore >= 80 && bestRecord ? { record: bestRecord, score: bestScore } : null
}

const LIST_KEYWORDS = [
  "list all", "show all", "give names", "what are the gi",
  "list of", "list gi", "show gi", "get gi", "all gi",
  "list the gi", "names of gi", "what are gi", "give all gi",
]

const RECIPE_KEYWORDS = [
  "recipe", "recepie", "recipie", "recepe", "recipi",
  "recipes", "recepies", "cook", "prepare", "ingredients",
  "how to make", "how to cook", "steps", "how to use",
  "used in cooking", "use in cooking",
]

const GREETING_KEYWORDS = [
  "hello", "hi", "namaste", "hey", "greetings",
  "good morning", "good evening", "good afternoon",
]

type Intent = "GREETING" | "LIST_GI_TAGS" | "TAG_DETAILS" | "RECIPE_QUERY" | "UNKNOWN"

function detectIntent(lower: string): { intent: Intent; record: GIRecord | null } {
  if (GREETING_KEYWORDS.some(kw => lower === kw || lower.startsWith(kw + " ") || lower.endsWith(" " + kw))) {
    return { intent: "GREETING", record: null }
  }

  if (
    LIST_KEYWORDS.some(kw => lower.includes(kw)) ||
    ["list", "gi tags", "gi tags list", "show list"].includes(lower)
  ) {
    return { intent: "LIST_GI_TAGS", record: null }
  }

  const match = fuzzyMatchProduct(lower)
  if (match) {
    const isRecipe = RECIPE_KEYWORDS.some(kw => lower.includes(kw))
    return { intent: isRecipe ? "RECIPE_QUERY" : "TAG_DETAILS", record: match.record }
  }

  return { intent: "UNKNOWN", record: null }
}

function formatDetails(r: GIRecord): string {
  const parts: string[] = [r.name]
  parts.push("\nCategory:", r.category)
  parts.push("\nRegion:", r.region)
  parts.push("\nDescription:", r.description)

  if (r.category === "Handicraft") {
    if (r.uses.length) { parts.push("\nUses:"); r.uses.forEach(u => parts.push(`â€¢ ${u}`)) }
    if (r.examples.length) { parts.push("\nExamples:"); r.examples.forEach(e => parts.push(`â€¢ ${e}`)) }
  } else if (r.category === "Food Product") {
    if (r.ingredients.length) { parts.push("\nIngredients:"); r.ingredients.forEach(i => parts.push(`â€¢ ${i}`)) }
    if (r.recipe.length) { parts.push("\nRecipe:"); r.recipe.forEach((s, i) => parts.push(`${i + 1}. ${s}`)) }
    if (r.uses.length) { parts.push("\nUses:"); r.uses.forEach(u => parts.push(`â€¢ ${u}`)) }
  } else {
    if (r.examples.length) { parts.push("\nCharacteristics:"); r.examples.forEach(e => parts.push(`â€¢ ${e}`)) }
    if (r.uses.length) { parts.push("\nUses:"); r.uses.forEach(u => parts.push(`â€¢ ${u}`)) }
  }

  parts.push("\nGI Registration:", r.registration)
  return parts.join("\n")
}

function formatRecipe(r: GIRecord): string {
  const FOOD_CATS = ["Food Product", "Agricultural Product", "Spice Product", "Herbal Product"]
  if (!FOOD_CATS.includes(r.category)) {
    return "Recipes are only available for food-related GI products."
  }
  if (!r.recipe.length && !r.ingredients.length) {
    return `No recipe is available for ${r.name}. Try asking "Tell me about ${r.name}" for general information.`
  }

  const displayName = r.name.startsWith("Uttarakhand ") ? r.name.slice("Uttarakhand ".length) : r.name
  const parts: string[] = [r.recipe_title || `Recipe: ${r.name}`]
  parts.push("\nGI Product:", displayName)
  parts.push("\nRegion:", r.region)
  parts.push("\nDescription:", r.recipe_description || r.description)

  if (r.ingredients.length) { parts.push("\nIngredients:"); r.ingredients.forEach(i => parts.push(`â€¢ ${i}`)) }
  if (r.recipe.length) { parts.push("\nPreparation Steps:"); r.recipe.forEach((s, i) => parts.push(`${i + 1}. ${s}`)) }
  if (r.uses.length) { parts.push("\nUses:"); r.uses.forEach(u => parts.push(`â€¢ ${u}`)) }
  parts.push("\nTraditional Significance:", r.description)
  return parts.join("\n")
}

function formatList(): string {
  const names = products
    .filter(p => p.name !== "Bal Mithai")
    .map((p, i) => `${i + 1}. ${p.name}`)
    .join("\n")
  return `GI Tags of Uttarakhand\n\n${names}`
}

function greetingResponse(): string {
  return [
    "Namaste! ðŸ™ I'm your AI assistant for Uttarakhand's GI-tagged products.",
    "",
    "You can ask me:",
    "â€¢ About any GI product (e.g., \"Tell me about Aipan Art\")",
    "â€¢ Recipes (e.g., \"Recipe of Jhangora\")",
    "â€¢ \"List all GI tags\" to see all 27 registered products",
    "",
    "How can I help you today?",
  ].join("\n")
}

interface ScrapeResult {
  content: string
  sourceUrl: string
}

async function scrapeWikipedia(subject: string): Promise<ScrapeResult | null> {
  try {
    const searchQuery = `${subject} Uttarakhand`

    const searchUrl =
      `https://en.wikipedia.org/w/api.php` +
      `?action=opensearch&search=${encodeURIComponent(searchQuery)}` +
      `&limit=1&namespace=0&format=json`

    const searchRes = await fetch(searchUrl, {
      headers: { "User-Agent": "UttarakhandGI-Chatbot/1.0 (Vercel; educational)" },
      signal: AbortSignal.timeout(6000),
    })
    if (!searchRes.ok) return null

    const [, titles, , urls]: [string, string[], string[], string[]] = await searchRes.json()
    if (!titles?.[0]) return null

    const summaryUrl =
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titles[0])}`

    const summaryRes = await fetch(summaryUrl, {
      headers: { "User-Agent": "UttarakhandGI-Chatbot/1.0 (Vercel; educational)" },
      signal: AbortSignal.timeout(6000),
    })
    if (!summaryRes.ok) return null

    const summary = await summaryRes.json()
    const extract: string = summary?.extract || ""

    const lowerExtract = extract.toLowerCase()
    const relevant =
      lowerExtract.includes("uttarakhand") ||
      lowerExtract.includes("india") ||
      lowerExtract.includes("himalaya") ||
      lowerExtract.includes("kumaon") ||
      lowerExtract.includes("garhwal")

    if (!extract || !relevant) return null

    const pageUrl: string =
      summary?.content_urls?.desktop?.page ||
      urls?.[0] ||
      `https://en.wikipedia.org/wiki/${encodeURIComponent(titles[0])}`

    return { content: extract, sourceUrl: pageUrl }
  } catch {
    return null
  }
}

async function processMessage(
  message: string
): Promise<{ response: string; tag: string | null; source?: string; source_url?: string }> {
  const lower = message.trim().toLowerCase()

 
  const cached = cacheGet(lower)
  if (cached) return { response: cached.response, tag: cached.tag, source: "cache" }

  
  const { intent, record } = detectIntent(lower)

  let response = ""
  let tag: string | null = null
  let source: string | undefined
  let source_url: string | undefined

  if (intent === "GREETING") {
    response = greetingResponse()
    tag = "GREETING"

  } else if (intent === "LIST_GI_TAGS") {
    response = formatList()
    tag = "LIST_GI_TAGS"
    cacheSet(lower, response, tag)

  } else if (intent === "TAG_DETAILS" && record) {
    response = formatDetails(record)
    tag = record.category
    source = "knowledge_base"
    cacheSet(lower, response, tag)

  } else if (intent === "RECIPE_QUERY" && record) {
    response = formatRecipe(record)
    tag = record.category
    source = "knowledge_base"
    cacheSet(lower, response, tag)

  } else {
  
    const cleanQuery = cleanFillerWords(lower) || lower
    const scraped = await scrapeWikipedia(cleanQuery)

    if (scraped) {
      response = [
        `Here is what I found about "${cleanQuery}":`,
        "",
        scraped.content,
        "",
        "âš ï¸ This information is from Wikipedia, not the official GI tag knowledge base.",
      ].join("\n")
      tag = "web_scrape"
      source = "web_scrape"
      source_url = scraped.sourceUrl
      cacheSet(lower, response, tag)
    } else {
      response = [
        "Not a valid Uttarakhand GI Tag query.",
        "",
        "Try asking:",
        "â€¢ \"Tell me about Berinag Tea\"",
        "â€¢ \"Recipe of Mandua\"",
        "â€¢ \"List all GI tags of Uttarakhand\"",
        "â€¢ \"What is Aipan Art?\"",
      ].join("\n")
    }
  }

  return { response, tag, source, source_url }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationId } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    const { response, tag, source, source_url } = await processMessage(message)

    return NextResponse.json({
      success: true,
      data: {
        message: response,
        tag,
        source,
        source_url,
        conversationId: conversationId || `conv-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json({ success: false, error: "Failed to process message" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: "uttarakhand-gi-chatbot",
    status: "ok",
    products_loaded: products.length,
    timestamp: new Date().toISOString(),
  })
}
