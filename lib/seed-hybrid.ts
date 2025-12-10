import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file explicitly
config({ path: resolve(process.cwd(), '.env.local') })
config() // Also load .env if exists

import { getDatabaseService } from './database-service'
import { FirebaseService, initializeFirebase } from './firebase'
import { allGIProducts } from './gi-products-complete'
import connectDB from './database'
import { Review } from './models/Review'

// Initialize Firebase after env vars are loaded
initializeFirebase()

// Sample data for seeding
const sampleArtisans = [
  {
    name: "Rajesh Negi",
    village: "Munsiyari",
    district: "Pithoragarh",
    region: "Kumaon",
    specialization: "Organic Farming",
    experience: "25 years",
    bio: "Rajesh has been practicing organic farming in the high altitudes of Munsiyari for over two decades. He specializes in growing traditional crops like Rajma and has been instrumental in preserving indigenous seed varieties.",
    image: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
    cloudinaryPublicId: "uttarakhand-heritage/artisans/rajesh-negi",
    products: [],
    skills: ["Organic Farming", "Seed Preservation", "Traditional Agriculture"],
    achievements: [
      "GI Certification for Munsiyari Rajma",
      "Best Organic Farmer Award 2022",
      "Traditional Knowledge Preservation Award"
    ],
    contact: {
      phone: "+91-9876543210",
      email: "rajesh.negi@example.com",
      whatsapp: "+91-9876543210",
      address: "Munsiyari Village, Pithoragarh, Uttarakhand"
    },
    workshopsOffered: [
      {
        title: "Organic Farming Techniques",
        duration: "2 days",
        price: 2500,
        description: "Learn traditional organic farming methods used in high-altitude regions",
        maxParticipants: 15,
        available: true
      },
      {
        title: "Seed Preservation Workshop",
        duration: "1 day",
        price: 1500,
        description: "Traditional methods of preserving indigenous seeds",
        maxParticipants: 10,
        available: true
      }
    ],
    availability: "Available for workshops and consultations",
    languages: ["Hindi", "Kumaoni", "English"],
    certifications: ["Organic Farming Certificate", "GI Product Certification"],
    socialImpact: {
      familiesSupported: 25,
      studentsTrained: 150,
      culturalEvents: 12,
      communityProjects: 8
    },
    testimonials: [],
    gallery: [],
    cloudinaryGalleryIds: [],
    socialMedia: {
      facebook: "https://facebook.com/rajeshnegi",
      instagram: "https://instagram.com/rajeshnegi"
    },
    location: {
      latitude: 30.0668,
      longitude: 80.2456,
      address: "Munsiyari Village, Pithoragarh, Uttarakhand"
    },
    tags: ["organic", "farming", "traditional", "agriculture"],
    keywords: ["organic", "farming", "rajma", "traditional", "agriculture", "seeds"]
  },
  {
    name: "Meera Bisht",
    village: "Almora",
    district: "Almora",
    region: "Kumaon",
    specialization: "Aipan Art",
    experience: "30 years",
    bio: "Meera is a master of Aipan art, a traditional geometric art form of Kumaon. She has been practicing this sacred art for three decades and has trained hundreds of students in preserving this cultural heritage.",
    image: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
    cloudinaryPublicId: "uttarakhand-heritage/artisans/meera-bisht",
    products: [],
    skills: ["Aipan Art", "Traditional Painting", "Cultural Education"],
    achievements: [
      "Master Artisan Award 2021",
      "Cultural Heritage Preservation Award",
      "Best Teacher Award 2020"
    ],
    contact: {
      phone: "+91-9876543211",
      email: "meera.bisht@example.com",
      whatsapp: "+91-9876543211",
      address: "Almora Village, Almora, Uttarakhand"
    },
    workshopsOffered: [
      {
        title: "Aipan Art Workshop",
        duration: "3 days",
        price: 3000,
        description: "Learn the sacred art of Aipan with traditional techniques",
        maxParticipants: 12,
        available: true
      }
    ],
    availability: "Available for workshops and cultural demonstrations",
    languages: ["Hindi", "Kumaoni", "English"],
    certifications: ["Traditional Art Certificate", "Cultural Heritage Certificate"],
    socialImpact: {
      familiesSupported: 30,
      studentsTrained: 200,
      culturalEvents: 20,
      communityProjects: 10
    },
    testimonials: [],
    gallery: [],
    cloudinaryGalleryIds: [],
    socialMedia: {
      instagram: "https://instagram.com/meerabisht"
    },
    location: {
      latitude: 29.5918,
      longitude: 79.6531,
      address: "Almora Village, Almora, Uttarakhand"
    },
    tags: ["aipan", "art", "traditional", "cultural"],
    keywords: ["aipan", "art", "traditional", "painting", "cultural", "sacred"]
  }
]

// Use all 27 GI products from the complete list
// Filter to keep existing ones and add missing ones
const existingProductNames = ["Munsiyari Rajma", "Aipan Art Painting"]
const sampleProducts = allGIProducts.map(product => {
  // Update existing products to match current structure
  if (product.name === "Munsiyari White Kidney Beans (Rajma)") {
    return {
      ...product,
      name: "Munsiyari Rajma",
      giRegistrationNumber: "854",
      artisan: {
        id: "rajesh-negi-id",
        name: "Rajesh Negi",
        village: "Munsiyari",
        district: "Pithoragarh",
        experience: "25+ years",
        specialization: "Organic farming",
        contact: "rajesh.negi@example.com",
        bio: "Rajesh has been practicing organic farming in the high altitudes of Munsiyari for over two decades."
      }
    }
  }
  if (product.name === "Aipan Art") {
    return {
      ...product,
      name: "Aipan Art Painting",
      artisan: {
        id: "meera-bisht-id",
        name: "Meera Bisht",
        village: "Almora",
        district: "Almora",
        experience: "30+ years",
        specialization: "Aipan Art",
        contact: "meera.bisht@example.com",
        bio: "Master artist who learned this traditional art from her grandmother and now teaches it to preserve the cultural heritage."
      }
    }
  }
  return product
})

export async function seedDatabase() {
  try {
    console.log('🌱 Starting hybrid database seeding...')
    
    // Try to connect to MongoDB first and clear if available
    try {
      const connectDB = (await import('./database')).default
      const mongoConnection = await connectDB()
      if (mongoConnection) {
        console.log('📊 MongoDB connected - clearing collections...')
        const { Product } = await import('./models/Product')
        const { Artisan } = await import('./models/Artisan')
        const { User } = await import('./models/User')
        
        await Product.deleteMany({})
        await Artisan.deleteMany({})
        await User.deleteMany({})
        console.log('✅ MongoDB collections cleared')
      }
    } catch (mongoError: any) {
      console.log('⚠️ MongoDB connection error:', mongoError.message)
      console.log('⚠️ MongoDB not available, will use Firebase if configured')
    }
    
    const db = await getDatabaseService()
    
    // Clear existing data for Firebase if using Firebase
    if (db.constructor.name === 'FirebaseDatabaseService') {
      console.log('🔥 Using Firebase - clearing collections')
      try {
        const { db: firestore } = await import('./firebase')
        if (firestore) {
          const collections = ['artisans', 'products', 'users']
          for (const col of collections) {
            const snapshot = await firestore.collection(col).get()
            const batch = firestore.batch()
            snapshot.docs.forEach(doc => batch.delete(doc.ref))
            if (snapshot.docs.length > 0) await batch.commit()
          }
          console.log('✅ Firebase collections cleared')
        }
      } catch (firebaseError) {
        console.log('⚠️ Could not clear Firebase collections:', firebaseError)
      }
    }
    
    // Create artisans first
    console.log('👨‍🌾 Creating artisans...')
  const createdArtisans: any[] = []
    for (const artisanData of sampleArtisans) {
      try {
        const artisan = await db.createArtisan(artisanData)
        createdArtisans.push(artisan)
        console.log(`✅ Created artisan: ${artisan.name}`)
      } catch (err: unknown) {
        console.error(`❌ Failed to create artisan ${artisanData.name}:`, err)
      }
    }
    
    // Update product artisan IDs - assign to artisans based on region/specialization
    const updatedProducts = sampleProducts.map((product) => {
      // Find matching artisan or use first available
      let assignedArtisan = createdArtisans[0]
      if (product.artisan.id === "rajesh-negi-id" || product.category === "Agricultural") {
        assignedArtisan = createdArtisans.find(a => a.name === "Rajesh Negi") || createdArtisans[0]
      } else if (product.artisan.id === "meera-bisht-id" || product.category === "Handicraft") {
        assignedArtisan = createdArtisans.find(a => a.name === "Meera Bisht") || createdArtisans[0]
      }
      
      return {
        ...product,
        artisan: {
          ...product.artisan,
          id: assignedArtisan?.id || assignedArtisan?._id || product.artisan.id
        }
      }
    })
    
    // Create products
    console.log('🌾 Creating products...')
  const createdProducts: any[] = []
    for (const productData of updatedProducts) {
      try {
        const product = await db.createProduct(productData)
        createdProducts.push(product)
        console.log(`✅ Created product: ${product.name}`)
      } catch (err: unknown) {
        console.error(`❌ Failed to create product ${productData.name}:`, err)
      }
    }
    
    // Update artisan products
    console.log('🔗 Linking products to artisans...')
    for (let i = 0; i < createdArtisans.length; i++) {
      try {
        const artisanId = createdArtisans[i]?.id || createdArtisans[i]?._id
        const productId = createdProducts[i]?.id || createdProducts[i]?._id
        
        if (artisanId && productId) {
          await db.updateArtisan(artisanId, {
            products: [productId]
          })
          console.log(`✅ Linked product to artisan: ${createdArtisans[i].name}`)
        }
      } catch (err: unknown) {
        console.error(`❌ Failed to link product to artisan:`, err)
      }
    }
    
    // Create a sample user
    console.log('👤 Creating sample user...')
    const sampleUser = {
      name: "Test User",
      email: "test@example.com",
      preferences: {
        language: "en",
        region: "all",
        interests: ["traditional-crafts", "organic-farming"],
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      },
      culturalInterests: ["Traditional Crafts", "Organic Farming", "Cultural Heritage"],
      learningProgress: {
        completedCourses: [],
        currentCourses: [],
        achievements: [],
        points: 0,
        level: "Beginner"
      },
      savedHeritageItems: createdProducts.length > 0 ? [createdProducts[0]?.id || createdProducts[0]?._id] : [],
      reviews: [],
      profile: {
        bio: "Interested in learning about Uttarakhand's cultural heritage"
      },
      socialMedia: {},
      activity: []
    }
    
    try {
      await db.createUser(sampleUser)
      console.log('✅ Created sample user')
    } catch (err: unknown) {
      console.error('❌ Failed to create sample user:', err)
    }
    
    // Initialize reviews collection (without seeding data)
    console.log('📝 Initializing reviews collection...')
    try {
      await Review.init() // This creates the collection with indexes
      console.log('✅ Reviews collection initialized')
    } catch (err: unknown) {
      console.error('❌ Failed to initialize reviews collection:', err)
    }
    
    console.log('🎉 Hybrid database seeding completed successfully!')
    
    return {
      artisans: createdArtisans.length,
      products: createdProducts.length,
      users: 1,
      database: db.constructor.name
    }
  } catch (err: unknown) {
    console.error('❌ Error seeding database:', err)
    throw err
  }
}

// Run seeding if called directly (ES module compatible)
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                     process.argv[1]?.includes('seed-hybrid')

if (isMainModule) {
  seedDatabase()
    .then((result) => {
      console.log('✅ Seeding result:', result)
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}
