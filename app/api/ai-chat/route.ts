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

// ─────────────────────────────────────────────────────────────────────────────
// Filler word stripping  (English + common translated remnants)
// ─────────────────────────────────────────────────────────────────────────────
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
  // ── Translated remnants from Hindi/Gujarati/Marathi ──────────────────────
  "tell me about the ",
  "please tell me about ",
  "please share about ",
  "share information about ",
  "tell something about ",
  "please explain ",
  "explain about ",
  "give information about ",
  "give me details about ",
  "regarding ",
  "about ",
]

function cleanFillerWords(query: string): string {
  let q = query.toLowerCase().replace(/[^a-z0-9\s]/gi, "").trim()
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
    .replace(/\s+information$/, "")
    .replace(/\s+details$/, "")
    .trim()
}

// ─────────────────────────────────────────────────────────────────────────────
// Phonetic normalisation for common voice-recognition errors
// e.g. "ring all" → "ringaal", "tej pata" → "tejpatta"
// ─────────────────────────────────────────────────────────────────────────────
const VOICE_CORRECTIONS: [RegExp, string][] = [
  [/\bring\s*a+l+\b/gi, "ringaal"],
  [/\brin+ga+l\b/gi, "ringaal"],
  [/\btej\s*pat+[ae]?\b/gi, "tejpatta"],
  [/\btez\s*pat+[ae]?\b/gi, "tejpatta"],
  [/\bbay\s*leaf\b/gi, "tejpatta"],
  [/\bbal\s*mit+h?[aei]+\b/gi, "bal mithai"],
  [/\bber+i+na+g\b/gi, "berinag"],
  [/\bver+i+na+g\b/gi, "berinag"],
  [/\bva+r+e+na+g\b/gi, "berinag"],
  [/\bmund+u+[wv]a+\b/gi, "mandua"],
  [/\bman+d+u+[wv]a+\b/gi, "mandua"],
  [/\bma+d+u+[wv]a+\b/gi, "mandua"],
  [/\bjhang+o+r[ae]\b/gi, "jhangora"],
  [/\bjan+go+r[ae]\b/gi, "jhangora"],
  [/\baip+[ae]n+\b/gi, "aipan"],
  [/\beip+[ae]n+\b/gi, "aipan"],
  [/\bai+p+a+n+\b/gi, "aipan"],
  [/\bchaulai+\b/gi, "chaulai"],
  [/\bchau+la+\b/gi, "chaulai"],
  [/\bramdana+\b/gi, "ramdana"],
  [/\bburans+h?\b/gi, "buransh"],
  [/\bbur+an+s\b/gi, "buransh"],
  [/\bgahat+\b/gi, "gahat"],
  [/\bkul+[ae]th?\b/gi, "gahat"],
  [/\bkul+ti+\b/gi, "gahat"],
  [/\blitchee?\b/gi, "litchi"],
  [/\blych+ee?\b/gi, "litchi"],
  [/\bmalt+[ae]\b/gi, "malta"],
  [/\bmom+bat+i\b/gi, "mombatti"],
  [/\bnam+bat+i\b/gi, "mombatti"],
]

function applyVoiceCorrections(text: string): string {
  let out = text
  for (const [pattern, replacement] of VOICE_CORRECTIONS) {
    out = out.replace(pattern, replacement)
  }
  return out
}

// ─────────────────────────────────────────────────────────────────────────────
// Name aliases — covers every product in the 28-product dataset
// ─────────────────────────────────────────────────────────────────────────────
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

  // ── GI name variants ──────────────────────────────────────────────────────
  if (n.includes("tejpat")) candidates.push("tejpatta", "tej patta", "tejpat", "tej pata", "tezpatta")
  if (n.includes("ringaal") || n.includes("ringal")) candidates.push("ringal craft", "ringal", "ringaal", "rignaal", "ringaal bamboo")
  if (n.includes("bal mithai") || n.includes("bal mitai")) candidates.push("bal mitai", "bal mithai", "balmithai", "ball mithai")
  if (n.includes("munsyari") || n.includes("munsiyari")) candidates.push("munsiyari rajma", "munsyari rajma", "munsiyari", "mungsiyari rajma", "munsiari rajma")
  if (n.includes("bichhu") || n.includes("bichu")) candidates.push("bichhu buti", "bichu buti", "nettle fabric", "nettle fiber")
  if (n.includes("lakhori")) candidates.push("lakhori mirchi", "lakhori", "lakhori chilli", "almora lakhori")
  if (n.includes("berinag")) candidates.push("berinag tea", "berinag", "verinag tea", "barinag tea")
  if (n.includes("chiura") || n.includes("chyura")) candidates.push("chiura", "chyura", "chiura oil", "chyura oil", "chura oil")
  if (n.includes("tamta")) candidates.push("copper products", "tamta craft", "tamta")
  if (n.includes("pichhoda") || n.includes("pichora")) candidates.push("pichhoda", "pichora", "rangwali pichora", "pichwada")
  if (n.includes("mombatti") || n.includes("candle")) candidates.push("candle", "nainital mombatti", "mombatti", "mumbatti")
  if (n.includes("likhai")) candidates.push("likhai", "wood carving")
  if (n.includes("bhotiya") || n.includes("dann")) candidates.push("dann", "bhotiya dann", "bhotia dann", "rug", "bhotiya rug", "tibetan rug", "woolen carpet", "hand knotted rug")
  if (n.includes("chaulai") || n.includes("ramdana")) candidates.push("chaulai", "ramdana", "amaranth", "rajgira", "sagai", "ramdaana")
  if (n.includes("jhangora")) candidates.push("jhangora", "barnyard millet", "sawa millet", "jungle rice", "jangli chawal", "jhangra", "jhangra millet")
  if (n.includes("lal chawal")) candidates.push("lal chawal", "red rice", "red hill rice", "pahadi red rice", "mountain red rice", "hill red rice")
  if (n.includes("mandua")) candidates.push("mandua", "finger millet", "ragi", "mandwa", "nachni", "mandua millet", "madua")
  if (n.includes("malta")) candidates.push("malta", "malta orange", "malta fruit", "hill orange", "pahadi orange", "mountain orange", "malta citrus")
  if (n.includes("toor dal") || n.includes("pahari toor")) candidates.push("toor dal", "pahari dal", "pigeon pea", "arhar dal", "pigeon peas", "hill lentil", "pahadi toor")
  if (n.includes("gahat")) candidates.push("gahat", "horse gram", "kulath", "kulthi", "kulathi", "gahat bean", "gahat dal", "horse bean")
  if (n.includes("kala bhat")) candidates.push("kala bhat", "black soybean", "black beans", "kala soybean", "pahadi soybean", "black dal", "kala dal")
  if (n.includes("buransh")) candidates.push("buransh", "burans", "rhododendron", "rhododendron juice", "rhododendron sharbat", "flower juice", "buransh sharbat", "buransh juice")
  if (n.includes("ramman") || n.includes("wooden") || n.includes("mask")) candidates.push("wooden mask", "ramman mask", "chamoli mask", "wood mask", "ramman", "ritual mask", "chamoli wooden mask")
  if (n.includes("litchi")) candidates.push("litchi", "lychee", "leechi", "nainital litchi", "ramnagar litchi", "lichi")
  if (n.includes("aadu") || n.includes("peach")) candidates.push("peach", "aadu", "aadhu", "stone fruit", "nainital peach", "ramgarh peach", "pahadi peach")
  if (n.includes("basmati")) candidates.push("basmati", "aromatic rice", "long grain rice", "scented rice", "rice")

  // ── English common-name aliases (translation-bridge) ─────────────────────
  // What Google Translate typically returns when translating product names
  // from Hindi / Gujarati / Marathi
  if (n.includes("tejpat")) {
    candidates.push("bay leaf", "bay leaves", "indian bay leaf", "tejpat leaves",
      "tej patta leaves", "cinnamomum tamala", "malabar leaf",
      "tez patta", "tez pata", "tej pata leaves", "masala leaf", "spice leaf")
  }
  if (n.includes("mandua")) {
    candidates.push("finger millet", "ragi", "mandwa", "nachni", "mandua millet",
      "eleusine coracana", "millet", "madua", "kumaoni ragi")
  }
  if (n.includes("jhangora")) {
    candidates.push("barnyard millet", "sawa millet", "jungle rice", "echinochloa",
      "japanese millet", "wild millet", "millet", "water millet")
  }
  if (n.includes("bichhu") || n.includes("bichu")) {
    candidates.push("nettle", "stinging nettle", "nettle fiber", "nettle fibre",
      "nettle fabric", "urtica dioica", "himalayan nettle", "bichhu grass")
  }
  if (n.includes("chiura") || n.includes("chyura")) {
    candidates.push("himalayan butter", "butter tree", "chyura butter",
      "aesculus indica oil", "wild plum oil", "horse chestnut oil", "pahadi ghee", "pahadi butter")
  }
  if (n.includes("munsyari") || n.includes("munsiyari")) {
    candidates.push("rajma", "kidney beans", "red beans", "rajma beans",
      "mountain kidney beans", "himalayan rajma", "pahadi rajma")
  }
  if (n.includes("ringaal") || n.includes("ringal")) {
    candidates.push("bamboo craft", "ringal basket", "himalayan bamboo",
      "bamboo weaving", "bamboo products", "bamboo", "cane craft", "bamboo basket", "baans craft")
  }
  if (n.includes("aipan")) {
    candidates.push("aipan", "kumaoni art", "ritual art", "floor painting",
      "folk art", "folk painting", "rangoli", "aipan painting", "kumaon art",
      "traditional painting", "wall art", "kumaoni rangoli", "floor art")
  }
  if (n.includes("malta")) {
    candidates.push("malta orange", "hill orange", "pahadi orange",
      "pahadi malta", "mountain orange", "malta citrus", "citrus fruit", "hill citrus")
  }
  if (n.includes("bal mithai") || n.includes("bal mitai")) {
    candidates.push("sweet ball", "chocolate sweet", "indian sweet ball",
      "mithai", "fudge ball", "candy ball", "traditional sweet", "kumaoni sweet", "bal candy")
  }
  if (n.includes("thulma")) {
    candidates.push("woolen blanket", "hill blanket", "pahari blanket",
      "traditional blanket", "wool blanket", "handmade blanket", "woolen shawl")
  }
  if (n.includes("lakhori")) {
    candidates.push("small chili", "round chilli", "lakhori pepper",
      "hill chilli", "mountain chili", "chili pepper", "round chili", "tiny chilli", "chilli")
  }
  if (n.includes("berinag")) {
    candidates.push("organic tea", "green tea", "kumaon tea", "hill tea",
      "tea", "black tea", "darjeeling style tea", "mountain tea", "pahadi chai",
      "uttarakhand tea", "himalayan tea", "chai")
  }
  if (n.includes("tamta")) {
    candidates.push("copper", "copper craft", "copper vessel", "copper pot",
      "brassware", "copper utensil", "metal craft", "tamba", "taamba craft", "copper art")
  }
  if (n.includes("basmati")) {
    candidates.push("aromatic rice", "long grain rice", "scented rice",
      "rice", "basmati", "sugandhit chawal", "fragrant rice")
  }
  if (n.includes("pichhoda") || n.includes("pichora")) {
    candidates.push("traditional cloth", "ceremonial cloth", "pahari cloth",
      "ritual cloth", "traditional saree", "kumaoni cloth", "kumaoni fabric")
  }
  if (n.includes("mombatti") || n.includes("candle")) {
    candidates.push("wax candle", "handmade candle", "nainital candle",
      "scented candle", "beeswax candle", "candle making", "mombatti")
  }
  if (n.includes("likhai")) {
    candidates.push("wood carving", "wood craft", "timber carving",
      "wooden craft", "wood art", "carving", "wooden furniture", "wood work")
  }
  if (n.includes("bhotiya") || n.includes("dann")) {
    candidates.push("carpet", "rug", "bhotia carpet", "himalayan carpet",
      "traditional carpet", "woolen rug", "tibetan style rug", "pile carpet", "floor rug", "hand knotted")
  }
  if (n.includes("chaulai") || n.includes("ramdana")) {
    candidates.push("amaranth", "amaranth grain", "ramdaana", "rajgira",
      "amaranthus", "chaulai grain", "red amaranth", "sagai", "mountain grain")
  }
  if (n.includes("lal chawal")) {
    candidates.push("red rice", "pahadi lal chawal", "hill red rice", "red hill rice",
      "traditional red rice", "mountain red rice", "lal chawal", "red paddy")
  }
  if (n.includes("toor dal") || n.includes("pahari toor")) {
    candidates.push("toor dal", "pigeon pea", "arhar dal", "lentil", "dal",
      "hill lentil", "pahadi dal", "mountain lentil", "yellow dal")
  }
  if (n.includes("gahat")) {
    candidates.push("horse gram", "kulath", "kulthi", "horse bean", "gahat bean",
      "kulathi dal", "mountain lentil", "pahadi dal", "hill horse gram")
  }
  if (n.includes("kala bhat")) {
    candidates.push("black soybean", "black bean", "black dal", "kala soybean",
      "pahadi soybean", "hill soybean", "kala dal", "dark bean")
  }
  if (n.includes("buransh")) {
    candidates.push("rhododendron", "rhododendron juice", "burans",
      "rhododendron drink", "flower juice", "buransh juice", "hill flower drink",
      "red flower juice", "buransh sharbat", "rhododendron sharbat", "flower sharbat")
  }
  if (n.includes("ramman") || (n.includes("wooden") && n.includes("mask"))) {
    candidates.push("wooden mask", "ramman mask", "ritual mask", "chamoli mask",
      "festival mask", "wood mask", "ramman", "chamoli wooden")
  }
  if (n.includes("litchi")) {
    candidates.push("litchi", "lychee", "lichi", "lychee fruit", "ramnagar lychee",
      "nainital lychee", "hill litchi", "pahadi litchi")
  }
  if (n.includes("aadu") || n.includes("peach")) {
    candidates.push("peach", "aadu", "stone fruit", "nainital peach",
      "ramgarh peach", "pahadi peach", "hill peach", "mountain peach", "plum")
  }

  return [...new Set(candidates)]
}

// ─────────────────────────────────────────────────────────────────────────────
// Fuzzy matching
// ─────────────────────────────────────────────────────────────────────────────
function fuseScore(query: string, candidate: string): number {
  const f = new Fuse([{ name: candidate }], {
    keys: ["name"],
    threshold: 1.0,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
  const results = f.search(query)
  if (!results.length) return 0
  return (1 - (results[0].score ?? 1)) * 100
}

/**
 * Dynamic threshold:
 * - Very short queries (1 word): 68  — voice recognition often gives a single word
 * - Short queries (2 words): 72
 * - Normal queries (3+ words): 78
 */
function getThreshold(cleaned: string): number {
  const wordCount = cleaned.split(/\s+/).length
  if (wordCount <= 1) return 68
  if (wordCount === 2) return 72
  return 78
}

function fuzzyMatchProduct(query: string): { record: GIRecord; score: number } | null {
  const cleaned = cleanFillerWords(query)
  if (!cleaned) return null

  const threshold = getThreshold(cleaned)

  let bestScore = 0
  let bestRecord: GIRecord | null = null

  for (const product of products) {
    const candidates = getMatchCandidates(product.name)
    for (const candidate of candidates) {
      const score = Math.max(
        fuseScore(cleaned, candidate),
        fuseScore(query.toLowerCase(), candidate)
      )
      if (score > bestScore) {
        bestScore = score
        bestRecord = product
      }
    }
  }

  if (bestScore >= threshold && bestRecord) return { record: bestRecord, score: bestScore }

  // ── Word-level fallback: try each word individually ───────────────────────
  // Helps when voice splits a product name: "ring aal" → "ring", "aal"
  const words = cleaned.split(/\s+/).filter(w => w.length >= 3)
  for (const word of words) {
    let wBestScore = 0
    let wBestRecord: GIRecord | null = null
    for (const product of products) {
      const candidates = getMatchCandidates(product.name)
      for (const candidate of candidates) {
        const score = fuseScore(word, candidate)
        if (score > wBestScore) {
          wBestScore = score
          wBestRecord = product
        }
      }
    }
    if (wBestScore >= 80 && wBestRecord) {
      return { record: wBestRecord, score: wBestScore }
    }
  }

  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Intent keywords
// ─────────────────────────────────────────────────────────────────────────────
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
  // Apply voice corrections first
  const normalized = applyVoiceCorrections(lower)

  if (GREETING_KEYWORDS.some(kw => normalized === kw || normalized.startsWith(kw + " ") || normalized.endsWith(" " + kw))) {
    return { intent: "GREETING", record: null }
  }

  if (
    LIST_KEYWORDS.some(kw => normalized.includes(kw)) ||
    ["list", "gi tags", "gi tags list", "show list"].includes(normalized)
  ) {
    return { intent: "LIST_GI_TAGS", record: null }
  }

  // Try fuzzy match on voice-corrected query first, then original
  const match = fuzzyMatchProduct(normalized) ?? fuzzyMatchProduct(lower)
  if (match) {
    const isRecipe = RECIPE_KEYWORDS.some(kw => normalized.includes(kw) || lower.includes(kw))
    return { intent: isRecipe ? "RECIPE_QUERY" : "TAG_DETAILS", record: match.record }
  }

  return { intent: "UNKNOWN", record: null }
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatters
// ─────────────────────────────────────────────────────────────────────────────
function formatDetails(r: GIRecord): string {
  const parts: string[] = [r.name]
  parts.push("\nCategory:", r.category)
  parts.push("\nRegion:", r.region)
  parts.push("\nDescription:", r.description)

  if (r.category === "Handicraft") {
    if (r.uses.length) { parts.push("\nUses:"); r.uses.forEach(u => parts.push(`• ${u}`)) }
    if (r.examples.length) { parts.push("\nExamples:"); r.examples.forEach(e => parts.push(`• ${e}`)) }
  } else if (r.category === "Food Product") {
    if (r.ingredients.length) { parts.push("\nIngredients:"); r.ingredients.forEach(i => parts.push(`• ${i}`)) }
    if (r.recipe.length) { parts.push("\nRecipe:"); r.recipe.forEach((s, i) => parts.push(`${i + 1}. ${s}`)) }
    if (r.uses.length) { parts.push("\nUses:"); r.uses.forEach(u => parts.push(`• ${u}`)) }
  } else {
    if (r.examples.length) { parts.push("\nCharacteristics:"); r.examples.forEach(e => parts.push(`• ${e}`)) }
    if (r.uses.length) { parts.push("\nUses:"); r.uses.forEach(u => parts.push(`• ${u}`)) }
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

  if (r.ingredients.length) { parts.push("\nIngredients:"); r.ingredients.forEach(i => parts.push(`• ${i}`)) }
  if (r.recipe.length) { parts.push("\nPreparation Steps:"); r.recipe.forEach((s, i) => parts.push(`${i + 1}. ${s}`)) }
  if (r.uses.length) { parts.push("\nUses:"); r.uses.forEach(u => parts.push(`• ${u}`)) }
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
    "Namaste! 🙏 I'm your AI assistant for Uttarakhand's GI-tagged products.",
    "",
    "You can ask me:",
    "• About any GI product (e.g., \"Tell me about Aipan Art\")",
    "• Recipes (e.g., \"Recipe of Jhangora\")",
    "• \"List all GI tags\" to see all 27 registered products",
    "",
    "How can I help you today?",
  ].join("\n")
}

// ─────────────────────────────────────────────────────────────────────────────
// Wikipedia scrape fallback
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Core message processor
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if the string is predominantly Latin/ASCII English.
 * Used to detect when a translated query is still in native script.
 */
function isPredominantlyEnglish(text: string): boolean {
  if (!text || text.length === 0) return false
  const letters = text.match(/[a-zA-Z]/g)?.length ?? 0
  return letters / text.length > 0.5
}

async function processMessage(
  message: string,
  /** Original native-language text (before translation), if provided */
  originalNative?: string
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
    // UNKNOWN intent — Wikipedia scrape as last resort
    const cleanQuery = cleanFillerWords(lower) || lower
    const scraped = await scrapeWikipedia(cleanQuery)

    if (scraped) {
      response = [
        `Here is what I found about "${cleanQuery}":`,
        "",
        scraped.content,
        "",
        "⚠️ This information is from Wikipedia, not the official GI tag knowledge base.",
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
        "• \"Tell me about Berinag Tea\"",
        "• \"Recipe of Mandua\"",
        "• \"List all GI tags of Uttarakhand\"",
        "• \"What is Aipan Art?\"",
      ].join("\n")
    }
  }

  return { response, tag, source, source_url }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, originalNative, conversationId } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    // If the "translated" message doesn't look like English, treat originalNative as the query
    const effectiveMessage = isPredominantlyEnglish(message)
      ? message
      : (originalNative || message)

    const { response, tag, source, source_url } = await processMessage(effectiveMessage, originalNative)

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
