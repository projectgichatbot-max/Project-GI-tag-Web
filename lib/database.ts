import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/uttarakhand_gi_products'

// Check if MongoDB URI is provided
if (!MONGODB_URI) {
  console.warn('MONGODB_URI not found. Using Firebase as primary database.')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

let cached: MongooseCache = (globalThis as any).mongoose as MongooseCache

if (!cached) {
  cached = { conn: null, promise: null }
  ;(globalThis as any).mongoose = cached
}

async function connectDB() {
  // If MongoDB URI is not provided, skip MongoDB connection
  if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/uttarakhand_gi_products') {
    console.log('⚠️ MongoDB URI not configured. Using Firebase as primary database.')
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log('✅ Connected to MongoDB')
        return m
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error)
        console.log('🔄 Falling back to Firebase database')
        // Re-throw so outer await catch sets promise null and returns fallback
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch {
    cached.promise = null
    console.log('🔄 MongoDB connection failed, using Firebase')
    return null
  }

  return cached.conn
}

export default connectDB

// Extend global type for TypeScript
declare global { var mongoose: MongooseCache | undefined }
