// Complete database seeding script with MongoDB + Firebase + Cloudinary
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import mongoose from 'mongoose'
import admin from 'firebase-admin'
import { v2 as cloudinary } from 'cloudinary'

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

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const sampleData = {
  artisans: [
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
        address: "Munsiyari Village, Pithoragarh"
      },
      workshopsOffered: [],
      availability: "Available for workshops",
      languages: ["Hindi", "Kumaoni", "English"],
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
        address: "Munsiyari Village, Pithoragarh"
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
      skills: ["Aipan Art", "Traditional Painting"],
      achievements: ["Master Artisan Award 2021"],
      contact: {
        phone: "+91-9876543211",
        email: "meera.bisht@example.com",
        whatsapp: "+91-9876543211",
        address: "Almora Village, Almora"
      },
      workshopsOffered: [],
      availability: "Available for workshops",
      languages: ["Hindi", "Kumaoni", "English"],
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
        address: "Almora Village, Almora"
      },
      tags: ["aipan", "art"],
      keywords: ["aipan", "art", "traditional"]
    }
  ],
  products: [
    {
      name: "Munsiyari Rajma",
      category: "Agricultural",
      region: "Pithoragarh District (Munsiyari)",
      description: "Small-sized red beans, rich in taste, grown in high-altitude organic conditions",
      longDescription: "Munsiyari Rajma is a premium variety of kidney beans grown in the high-altitude regions of Pithoragarh district.",
      healthBenefits: [
        "Rich in iron & calcium",
        "High protein content (22g per 100g)",
        "Diabetic-friendly with low glycemic index"
      ],
      culturalSignificance: "Traditional staple food of Kumaon region, often prepared during festivals.",
      images: ["/munsiyari-rajma-kidney-beans-red.jpg"],
      cloudinaryPublicIds: ["uttarakhand-heritage/products/munsiyari-rajma-1"],
      rating: 4.8,
      reviewsCount: 124,
      culturalValue: "Traditional staple food of Kumaon region",
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
        bio: "Rajesh has been practicing organic farming in the high altitudes of Munsiyari."
      },
      nutritionalInfo: {
        protein: "22g",
        carbs: "60g",
        fiber: "15g",
        iron: "8.2mg",
        calcium: "143mg",
        calories: "333 kcal"
      },
      harvestSeason: "September - October",
      shelfLife: "12 months",
      storageInstructions: "Store in a cool, dry place",
      cookingInstructions: ["Soak beans overnight", "Pressure cook for 15-20 minutes"],
      seasonality: "Harvested in September-October",
      reviews: [],
      tags: ["organic", "traditional", "healthy"],
      keywords: ["rajma", "kidney beans", "protein", "organic"]
    },
    {
      name: "Aipan Art Painting",
      category: "Handicraft",
      region: "Kumaon Region",
      description: "Traditional geometric patterns painted with rice paste",
      longDescription: "Aipan is a traditional folk art of Kumaon region, characterized by intricate geometric patterns.",
      healthBenefits: ["Therapeutic art practice", "Stress relief through meditation"],
      culturalSignificance: "Sacred art form used in festivals and ceremonies.",
      images: ["/aipan-art-traditional-patterns-geometric.jpg"],
      cloudinaryPublicIds: ["uttarakhand-heritage/products/aipan-art-1"],
      rating: 4.9,
      reviewsCount: 89,
      culturalValue: "Sacred art form used in festivals",
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
        bio: "Master artist preserving traditional art."
      },
      dimensions: '12" x 16"',
      materials: "Rice paste, natural ochre, handmade paper",
      careInstructions: "Keep away from moisture and direct sunlight",
      reviews: [],
      tags: ["art", "traditional", "cultural"],
      keywords: ["aipan", "art", "geometric", "sacred"]
    }
  ]
}

async function seedDatabase() {
  console.log('🌱 Starting complete database seeding...\n')

  try {
    // Connect to MongoDB
    console.log('1️⃣ Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connected\n')

    // Get Firestore reference
    const firestore = admin.firestore()

    // Clear existing data
    console.log('2️⃣ Clearing existing data...')
    
    // Clear MongoDB
    const { Product } = await import('../lib/models/Product.ts')
    const { Artisan } = await import('../lib/models/Artisan.ts')
    const { User } = await import('../lib/models/User.ts')
    
    await Product.deleteMany({})
    await Artisan.deleteMany({})
    await User.deleteMany({})
    console.log('✅ MongoDB cleared')
    
    // Clear Firebase collections
    const collections = ['artisans', 'products', 'users']
    for (const collectionName of collections) {
      const snapshot = await firestore.collection(collectionName).get()
      const batch = firestore.batch()
      snapshot.docs.forEach(doc => batch.delete(doc.ref))
      await batch.commit()
    }
    console.log('✅ Firebase cleared\n')

    // Seed Artisans
    console.log('3️⃣ Creating artisans...')
    const createdArtisans = []
    
    for (const artisanData of sampleData.artisans) {
      // Create in MongoDB
      const mongoArtisan = await Artisan.create(artisanData)
      
      // Create in Firebase
      const firebaseRef = await firestore.collection('artisans').add({
        ...artisanData,
        mongoId: mongoArtisan._id.toString(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
      
      createdArtisans.push({
        mongo: mongoArtisan,
        firebase: firebaseRef,
        data: artisanData
      })
      
      console.log(`✅ Created artisan: ${artisanData.name}`)
    }
    console.log('')

    // Seed Products
    console.log('4️⃣ Creating products...')
    const createdProducts = []
    
    for (let i = 0; i < sampleData.products.length; i++) {
      const productData = {
        ...sampleData.products[i],
        artisan: {
          ...sampleData.products[i].artisan,
          id: createdArtisans[i].mongo._id.toString()
        }
      }
      
      // Create in MongoDB
      const mongoProduct = await Product.create(productData)
      
      // Create in Firebase
      const firebaseRef = await firestore.collection('products').add({
        ...productData,
        mongoId: mongoProduct._id.toString(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
      
      createdProducts.push({
        mongo: mongoProduct,
        firebase: firebaseRef,
        data: productData
      })
      
      console.log(`✅ Created product: ${productData.name}`)
    }
    console.log('')

    // Update artisan products
    console.log('5️⃣ Linking products to artisans...')
    for (let i = 0; i < createdArtisans.length; i++) {
      const productId = createdProducts[i].mongo._id.toString()
      
      // Update MongoDB
      await Artisan.findByIdAndUpdate(createdArtisans[i].mongo._id, {
        products: [productId]
      })
      
      // Update Firebase
      await createdArtisans[i].firebase.update({
        products: [productId],
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
      
      console.log(`✅ Linked product to: ${createdArtisans[i].data.name}`)
    }
    console.log('')

    // Create sample user
    console.log('6️⃣ Creating sample user...')
    const userData = {
      name: "Test User",
      email: "test@example.com",
      preferences: {
        language: "en",
        region: "all",
        interests: ["traditional-crafts", "organic-farming"],
        notifications: { email: true, sms: false, push: true }
      },
      culturalInterests: ["Traditional Crafts", "Organic Farming"],
      learningProgress: {
        completedCourses: [],
        currentCourses: [],
        achievements: [],
        points: 0,
        level: "Beginner"
      },
      savedHeritageItems: [createdProducts[0].mongo._id.toString()],
      reviews: [],
      profile: { bio: "Interested in learning about Uttarakhand's cultural heritage" },
      socialMedia: {},
      activity: []
    }
    
    // Create in MongoDB
    const mongoUser = await User.create(userData)
    
    // Create in Firebase
    await firestore.collection('users').add({
      ...userData,
      mongoId: mongoUser._id.toString(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })
    
    console.log('✅ Created sample user\n')

    // Summary
    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   Artisans: ${createdArtisans.length}`)
    console.log(`   Products: ${createdProducts.length}`)
    console.log(`   Users: 1`)
    console.log('\n💾 Data synced to:')
    console.log(`   ✅ MongoDB: ${mongoose.connection.name}`)
    console.log(`   ✅ Firebase: ${process.env.FIREBASE_PROJECT_ID}`)
    console.log('\n📁 Cloudinary folders ready:')
    console.log('   - uttarakhand-heritage/products/')
    console.log('   - uttarakhand-heritage/artisans/')
    console.log('   - uttarakhand-heritage/users/')
    console.log('   - uttarakhand-heritage/gallery/')

    // Close connections
    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase()
