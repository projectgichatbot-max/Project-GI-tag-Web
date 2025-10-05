// Simplified seed script using direct Mongoose + Firebase
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import admin from 'firebase-admin'

dotenv.config({ path: '.env.local' })

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  })
}

const sampleArtisans = [
  {
    name: "Rajesh Negi",
    village: "Munsiyari",
    district: "Pithoragarh",
    region: "Kumaon",
    specialization: "Organic Farming",
    experience: "25 years",
    bio: "Rajesh has been practicing organic farming in the high altitudes of Munsiyari for over two decades.",
    image: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
    cloudinaryPublicId: "uttarakhand-heritage/artisans/rajesh-negi",
    products: [],
    skills: ["Organic Farming", "Seed Preservation"],
    achievements: ["GI Certification for Munsiyari Rajma"],
    contact: {
      phone: "+91-9876543210",
      email: "rajesh.negi@example.com",
      whatsapp: "+91-9876543210",
      address: "Munsiyari Village"
    },
    workshopsOffered: [],
    availability: "Available",
    languages: ["Hindi", "Kumaoni"],
    certifications: ["Organic Farming Certificate"],
    socialImpact: {
      familiesSupported: 25,
      studentsTrained: 150,
      culturalEvents: 12,
      communityProjects: 8
    },
    testimonials: [],
    gallery: [],
    cloudinaryGalleryIds: [],
    socialMedia: {},
    location: {
      latitude: 30.0668,
      longitude: 80.2456,
      address: "Munsiyari Village"
    },
    tags: ["organic", "farming"],
    keywords: ["organic", "farming", "rajma"]
  },
  {
    name: "Meera Bisht",
    village: "Almora",
    district: "Almora",
    region: "Kumaon",
    specialization: "Aipan Art",
    experience: "30 years",
    bio: "Meera is a master of Aipan art, a traditional geometric art form of Kumaon.",
    image: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
    cloudinaryPublicId: "uttarakhand-heritage/artisans/meera-bisht",
    products: [],
    skills: ["Aipan Art"],
    achievements: ["Master Artisan Award 2021"],
    contact: {
      phone: "+91-9876543211",
      email: "meera.bisht@example.com",
      whatsapp: "+91-9876543211",
      address: "Almora Village"
    },
    workshopsOffered: [],
    availability: "Available",
    languages: ["Hindi", "Kumaoni"],
    certifications: ["Traditional Art Certificate"],
    socialImpact: {
      familiesSupported: 30,
      studentsTrained: 200,
      culturalEvents: 20,
      communityProjects: 10
    },
    testimonials: [],
    gallery: [],
    cloudinaryGalleryIds: [],
    socialMedia: {},
    location: {
      latitude: 29.5918,
      longitude: 79.6531,
      address: "Almora Village"
    },
    tags: ["aipan", "art"],
    keywords: ["aipan", "art"]
  }
]

const sampleProducts = [
  {
    name: "Munsiyari Rajma",
    category: "Agricultural",
    region: "Pithoragarh District",
    description: "Small-sized red beans, rich in taste, grown in high-altitude organic conditions",
    longDescription: "Munsiyari Rajma is a premium variety of kidney beans.",
    healthBenefits: ["Rich in iron & calcium", "High protein content"],
    culturalSignificance: "Traditional staple food of Kumaon region",
    images: ["/munsiyari-rajma-kidney-beans-red.jpg"],
    cloudinaryPublicIds: ["uttarakhand-heritage/products/munsiyari-rajma-1"],
    rating: 4.8,
    reviewsCount: 124,
    culturalValue: "Traditional staple food",
    available: true,
    giCertified: true,
    giRegistrationNumber: "GI-2019-0123",
    artisan: {
      id: "temp",
      name: "Rajesh Negi",
      village: "Munsiyari",
      district: "Pithoragarh",
      experience: "25+ years",
      specialization: "Organic farming",
      contact: "rajesh.negi@example.com",
      bio: "Organic farmer"
    },
    nutritionalInfo: {
      protein: "22g",
      carbs: "60g",
      fiber: "15g"
    },
    harvestSeason: "September - October",
    reviews: [],
    tags: ["organic", "traditional"],
    keywords: ["rajma", "kidney beans"]
  },
  {
    name: "Aipan Art Painting",
    category: "Handicraft",
    region: "Kumaon Region",
    description: "Traditional geometric patterns painted with rice paste",
    longDescription: "Aipan is a traditional folk art of Kumaon region.",
    healthBenefits: ["Therapeutic art practice"],
    culturalSignificance: "Sacred art form used in festivals",
    images: ["/aipan-art-traditional-patterns-geometric.jpg"],
    cloudinaryPublicIds: ["uttarakhand-heritage/products/aipan-art-1"],
    rating: 4.9,
    reviewsCount: 89,
    culturalValue: "Sacred art form",
    available: true,
    giCertified: true,
    giRegistrationNumber: "GI-2020-0456",
    artisan: {
      id: "temp",
      name: "Meera Bisht",
      village: "Almora",
      district: "Almora",
      experience: "30+ years",
      specialization: "Aipan Art",
      contact: "meera.bisht@example.com",
      bio: "Master artist"
    },
    dimensions: '12" x 16"',
    materials: "Rice paste, natural ochre",
    reviews: [],
    tags: ["art", "traditional"],
    keywords: ["aipan", "art"]
  }
]

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n')

  try {
    // Connect to MongoDB
    console.log('1️⃣ Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    const db = mongoose.connection.db
    console.log('✅ MongoDB connected\n')

    // Get Firestore
    const firestore = admin.firestore()

    // Clear existing data
    console.log('2️⃣ Clearing existing data...')
    await db.collection('artisans').deleteMany({})
    await db.collection('products').deleteMany({})
    await db.collection('users').deleteMany({})
    console.log('✅ MongoDB cleared')
    
    // Clear Firebase
    const collections = ['artisans', 'products', 'users']
    for (const col of collections) {
      const snapshot = await firestore.collection(col).get()
      const batch = firestore.batch()
      snapshot.docs.forEach(doc => batch.delete(doc.ref))
      if (snapshot.docs.length > 0) await batch.commit()
    }
    console.log('✅ Firebase cleared\n')

    // Seed Artisans
    console.log('3️⃣ Creating artisans...')
    const createdArtisans = []
    
    for (const artisan of sampleArtisans) {
      // MongoDB
      const mongoResult = await db.collection('artisans').insertOne({
        ...artisan,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      // Firebase
      const firebaseRef = await firestore.collection('artisans').add({
        ...artisan,
        mongoId: mongoResult.insertedId.toString(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
      
      createdArtisans.push({
        mongoId: mongoResult.insertedId,
        firebaseId: firebaseRef.id,
        name: artisan.name
      })
      
      console.log(`✅ Created artisan: ${artisan.name}`)
    }
    console.log('')

    // Seed Products
    console.log('4️⃣ Creating products...')
    const createdProducts = []
    
    for (let i = 0; i < sampleProducts.length; i++) {
      const product = {
        ...sampleProducts[i],
        artisan: {
          ...sampleProducts[i].artisan,
          id: createdArtisans[i].mongoId.toString()
        }
      }
      
      // MongoDB
      const mongoResult = await db.collection('products').insertOne({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      // Firebase
      const firebaseRef = await firestore.collection('products').add({
        ...product,
        mongoId: mongoResult.insertedId.toString(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
      
      createdProducts.push({
        mongoId: mongoResult.insertedId,
        firebaseId: firebaseRef.id,
        name: product.name
      })
      
      console.log(`✅ Created product: ${product.name}`)
    }
    console.log('')

    // Link products to artisans
    console.log('5️⃣ Linking products to artisans...')
    for (let i = 0; i < createdArtisans.length; i++) {
      const productId = createdProducts[i].mongoId.toString()
      
      // Update MongoDB
      await db.collection('artisans').updateOne(
        { _id: createdArtisans[i].mongoId },
        { $set: { products: [productId], updatedAt: new Date() } }
      )
      
      // Update Firebase (find doc first)
      const artisanSnapshot = await firestore.collection('artisans')
        .where('mongoId', '==', createdArtisans[i].mongoId.toString())
        .get()
      
      if (!artisanSnapshot.empty) {
        await artisanSnapshot.docs[0].ref.update({
          products: [productId],
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        })
      }
      
      console.log(`✅ Linked to: ${createdArtisans[i].name}`)
    }
    console.log('')

    // Create sample user
    console.log('6️⃣ Creating sample user...')
    const user = {
      name: "Test User",
      email: "test@example.com",
      preferences: {
        language: "en",
        region: "all",
        interests: ["traditional-crafts"],
        notifications: { email: true, sms: false, push: true }
      },
      culturalInterests: ["Traditional Crafts"],
      learningProgress: {
        completedCourses: [],
        currentCourses: [],
        achievements: [],
        points: 0,
        level: "Beginner"
      },
      savedHeritageItems: [createdProducts[0].mongoId.toString()],
      reviews: [],
      profile: { bio: "Heritage enthusiast" },
      socialMedia: {},
      activity: []
    }
    
    // MongoDB
    const userMongo = await db.collection('users').insertOne({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    // Firebase
    await firestore.collection('users').add({
      ...user,
      mongoId: userMongo.insertedId.toString(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })
    
    console.log('✅ Created sample user\n')

    // Summary
    console.log('═'.repeat(50))
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!')
    console.log('═'.repeat(50))
    console.log('\n📊 Data Created:')
    console.log(`   ✅ Artisans: ${createdArtisans.length}`)
    console.log(`   ✅ Products: ${createdProducts.length}`)
    console.log(`   ✅ Users: 1`)
    console.log('\n💾 Synced to Databases:')
    console.log(`   ✅ MongoDB: ${mongoose.connection.name}`)
    console.log(`   ✅ Firebase: ${process.env.FIREBASE_PROJECT_ID}`)
    console.log('\n📁 Cloudinary Folder Structure:')
    console.log('   📂 uttarakhand-heritage/')
    console.log('      ├─ 📁 products/ (ready for uploads)')
    console.log('      ├─ 📁 artisans/ (ready for uploads)')
    console.log('      ├─ 📁 users/ (ready for uploads)')
    console.log('      └─ 📁 gallery/ (ready for uploads)')
    console.log('\n💡 Next Steps:')
    console.log('   1. Run: npm run dev')
    console.log('   2. Visit: http://localhost:3000/products')
    console.log('   3. Check MongoDB Compass for data')
    console.log('   4. Check Firebase Console for collections')
    console.log('═'.repeat(50))

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

seedDatabase()
