import mongoose from 'mongoose'
import dns from 'node:dns'

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
  // Get MongoDB URI at runtime, not at module load time
  const MONGODB_URI = process.env.MONGODB_URI
  const defaultLocalhost = 'mongodb://localhost:27017/uttarakhand_gi_products'
  
  // If MongoDB URI is not provided or is default localhost, skip MongoDB connection
  if (!MONGODB_URI || MONGODB_URI === defaultLocalhost) {
    console.log('⚠️ MongoDB URI not configured. Using Firebase as primary database.')
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Buffer queries during connect — prevents "too early" errors with fallback DNS
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log('✅ Connected to MongoDB')
        return m
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message)
        // Re-throw so outer await catch sets promise null and triggers DNS fallback
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (error: any) {
    cached.promise = null

    // Some networks block default DNS SRV lookups used by mongodb+srv URIs.
    // Retry once with public DNS resolvers before giving up.
    const isSrvUri = MONGODB_URI.startsWith('mongodb+srv://')
    const isSrvDnsError =
      typeof error?.message === 'string' &&
      (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND'))

    if (isSrvUri && isSrvDnsError) {
      try {
        const currentDns = dns.getServers()
        const fallbackDns = ['8.8.8.8', '1.1.1.1']
        const hasFallback = fallbackDns.every((server) => currentDns.includes(server))
        if (!hasFallback) {
          dns.setServers(fallbackDns)
          console.log('🌐 Retrying MongoDB with fallback DNS resolvers')
        }

        // Fully disconnect first — resets Mongoose readyState so the retry starts clean
        try { await mongoose.disconnect() } catch { /* ignore */ }

        const opts = { bufferCommands: true } // Buffer queries during retry connect
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
          console.log('✅ Connected to MongoDB (fallback DNS)')
          return m
        })
        cached.conn = await cached.promise
        return cached.conn
      } catch (retryError: any) {
        cached.promise = null
        console.error('❌ MongoDB retry failed:', retryError?.message || 'Unknown error')
      }
    }

    console.log('🔄 MongoDB connection failed, using Firebase')
    return null
  }

  return cached.conn
}

export default connectDB

// Extend global type for TypeScript
declare global { var mongoose: MongooseCache | undefined }
