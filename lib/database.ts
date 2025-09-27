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
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
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

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB')
      return mongoose
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error)
      console.log('🔄 Falling back to Firebase database')
      return null
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.log('🔄 MongoDB connection failed, using Firebase')
    return null
  }

  return cached.conn
}

export default connectDB

// Extend global type for TypeScript
declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}
