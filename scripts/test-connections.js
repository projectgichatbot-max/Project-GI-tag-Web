// Test database and Cloudinary connections
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import admin from 'firebase-admin'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config({ path: '.env.local' })

async function testConnections() {
  console.log('🧪 Testing Connections...\n')

  // Test 1: MongoDB
  console.log('1️⃣ Testing MongoDB...')
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connected successfully!')
    console.log(`   Database: ${mongoose.connection.name}`)
    await mongoose.connection.close()
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
  }

  // Test 2: Firebase Admin
  console.log('\n2️⃣ Testing Firebase Admin...')
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        })
      })
    }
    
    const db = admin.firestore()
    await db.collection('_test').doc('_test').set({ test: true })
    await db.collection('_test').doc('_test').delete()
    
    console.log('✅ Firebase Admin initialized successfully!')
    console.log(`   Project: ${process.env.FIREBASE_PROJECT_ID}`)
  } catch (err) {
    console.error('❌ Firebase Admin initialization failed:', err.message)
  }

  // Test 3: Cloudinary
  console.log('\n3️⃣ Testing Cloudinary...')
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
    
    await cloudinary.api.ping()
    console.log('✅ Cloudinary connected successfully!')
    console.log(`   Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`)
  } catch (err) {
    console.error('❌ Cloudinary connection failed:', err.message)
  }

  console.log('\n🎉 Connection tests completed!')
}

testConnections().catch(console.error)
