import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Database helper functions
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db(process.env.MONGODB_DB_NAME || "uttarakhand_gi_products")
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase()
  return db.collection(collectionName)
}

// Collection schemas for reference
export const schemas = {
  products: {
    name: String,
    category: String,
    region: String,
    description: String,
    healthBenefits: [String],
    culturalSignificance: String,
    // Removed commercial fields (price, stock) – site is educational
    images: [String],
    availabilityNote: String, // textual educational availability/context note
    giCertified: Boolean,
    giRegistrationNumber: String,
    artisan: {
      id: Number,
      name: String,
      village: String,
      district: String,
    },
    nutritionalInfo: Object,
    reviews: [Object],
    createdAt: Date,
    updatedAt: Date,
  },
  artisans: {
    name: String,
    village: String,
    district: String,
    region: String,
    specialization: String,
    experience: String,
    bio: String,
    image: String,
    products: [String],
    skills: [String],
    achievements: [String],
    contact: Object,
    workshopsOffered: [Object],
    availability: String,
    languages: [String],
    certifications: [String],
    socialImpact: Object,
    testimonials: [Object],
    createdAt: Date,
    updatedAt: Date,
  },
  users: {
    name: String,
    email: String,
    preferences: Object,
    culturalInterests: [String],
    learningProgress: Object,
    savedHeritageItems: [Number], // renamed from wishlist (non‑commercial)
    reviews: [Object],
    createdAt: Date,
    updatedAt: Date,
  },
  inquiries: {
    name: String,
    email: String,
    subject: String,
    message: String,
    inquiryType: String,
    status: String,
    response: String,
    createdAt: Date,
    updatedAt: Date,
  },
}

export default clientPromise
