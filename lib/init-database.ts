import { getDatabaseService } from './database-service-fixed'

// Sample data for initialization
const sampleData = {
  artisans: [
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
  ],
  products: [
    {
      name: "Munsiyari Rajma",
      category: "Agricultural",
      region: "Pithoragarh District (Munsiyari)",
      description: "Small-sized red beans, rich in taste, grown in high-altitude organic conditions",
      longDescription: "Munsiyari Rajma is a premium variety of kidney beans grown in the high-altitude regions of Pithoragarh district. These small-sized red beans are cultivated using traditional organic farming methods passed down through generations.",
      healthBenefits: [
        "Rich in iron & calcium",
        "High protein content (22g per 100g)",
        "Diabetic-friendly with low glycemic index",
        "High fiber content aids digestion",
        "Rich in folate and magnesium"
      ],
      culturalSignificance: "Traditional staple food of Kumaon region, often prepared during festivals and special occasions. The beans are considered sacred and are offered in local temples during harvest festivals.",
      images: ["/munsiyari-rajma-kidney-beans-red.jpg"],
      cloudinaryPublicIds: ["uttarakhand-heritage/products/munsiyari-rajma-1"],
      rating: 4.8,
  reviewsCount: 124,
      culturalValue: "Traditional staple food of Kumaon region",
      available: true,
      giCertified: true,
      giRegistrationNumber: "GI-2019-0123",
      artisan: {
        id: "rajesh-negi-id",
        name: "Rajesh Negi",
        village: "Munsiyari",
        district: "Pithoragarh",
        experience: "25+ years",
        specialization: "Organic farming",
        contact: "rajesh.negi@example.com",
        bio: "Rajesh has been practicing organic farming in the high altitudes of Munsiyari for over two decades."
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
      storageInstructions: "Store in a cool, dry place away from direct sunlight",
      cookingInstructions: [
        "Soak beans overnight in water",
        "Pressure cook for 15-20 minutes",
        "Season with traditional spices",
        "Best served with rice or roti"
      ],
      seasonality: "Harvested in September-October",
  reviews: [],
      tags: ["organic", "traditional", "healthy", "protein-rich"],
      keywords: ["rajma", "kidney beans", "protein", "organic", "munsiyari", "health", "traditional"]
    },
    {
      name: "Aipan Art Painting",
      category: "Handicraft",
      region: "Kumaon Region",
      description: "Traditional geometric patterns painted with rice paste, representing cultural heritage",
      longDescription: "Aipan is a traditional folk art of Kumaon region, characterized by intricate geometric patterns painted with rice paste on red ochre background. This sacred art form is practiced during festivals, ceremonies, and auspicious occasions.",
      healthBenefits: ["Therapeutic art practice", "Stress relief through meditation", "Enhances creativity and focus"],
      culturalSignificance: "Sacred art form used in festivals and ceremonies, believed to bring prosperity and ward off evil spirits. Traditionally painted by women during Diwali, weddings, and other auspicious occasions.",
      images: ["/aipan-art-traditional-patterns-geometric.jpg"],
      cloudinaryPublicIds: ["uttarakhand-heritage/products/aipan-art-1"],
      rating: 4.9,
  reviewsCount: 89,
      culturalValue: "Sacred art form used in festivals and ceremonies",
      available: true,
      giCertified: true,
      giRegistrationNumber: "GI-2020-0456",
      artisan: {
        id: "meera-bisht-id",
        name: "Meera Bisht",
        village: "Almora",
        district: "Almora",
        experience: "30+ years",
        specialization: "Aipan Art",
        contact: "meera.bisht@example.com",
        bio: "Master artist who learned this traditional art from her grandmother and now teaches it to preserve the cultural heritage."
      },
      dimensions: '12" x 16"',
      materials: "Rice paste, natural ochre, handmade paper",
      careInstructions: "Keep away from moisture and direct sunlight",
  reviews: [],
      tags: ["art", "traditional", "cultural", "sacred"],
      keywords: ["aipan", "art", "geometric", "sacred", "spiritual", "traditional", "patterns"]
    }
  ],
  users: [
    {
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
      savedHeritageItems: [],
      reviews: [],
      profile: {
        bio: "Interested in learning about Uttarakhand's cultural heritage"
      },
      socialMedia: {},
      activity: []
    }
  ]
}

export async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...')
    
    const db = await getDatabaseService()
    console.log(`📊 Using database: ${db.constructor.name}`)
    
    // Create artisans
    console.log('👨‍🌾 Creating artisans...')
  const createdArtisans: any[] = [] // Using any due to abstraction layer returning different shapes (Mongo/Firebase)
    for (const artisanData of sampleData.artisans) {
      try {
        const artisan = await db.createArtisan(artisanData)
        createdArtisans.push(artisan)
        console.log(`✅ Created artisan: ${artisan.name || artisanData.name}`)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        console.error(`❌ Failed to create artisan ${artisanData.name}:`, msg)
      }
    }
    
    // Update product artisan IDs
    const updatedProducts = sampleData.products.map((product, index) => ({
      ...product,
      artisan: {
        ...product.artisan,
        id: createdArtisans[index]?.id || createdArtisans[index]?._id || `artisan-${index + 1}`
      }
    }))
    
    // Create products
    console.log('🌾 Creating products...')
  const createdProducts: any[] = []
    for (const productData of updatedProducts) {
      try {
        const product = await db.createProduct(productData)
        createdProducts.push(product)
        console.log(`✅ Created product: ${product.name || productData.name}`)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        console.error(`❌ Failed to create product ${productData.name}:`, msg)
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
        const msg = err instanceof Error ? err.message : 'Unknown error'
        console.error(`❌ Failed to link product to artisan:`, msg)
      }
    }
    
    // Create users
    console.log('👤 Creating users...')
    for (const userData of sampleData.users) {
      try {
        const user = await db.createUser(userData)
        console.log(`✅ Created user: ${user.name || userData.name}`)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        console.error(`❌ Failed to create user ${userData.name}:`, msg)
      }
    }
    
    console.log('🎉 Database initialization completed successfully!')
    
    return {
      success: true,
      artisans: createdArtisans.length,
      products: createdProducts.length,
      users: sampleData.users.length,
      database: db.constructor.name
    }
  } catch (err: unknown) {
    console.error('❌ Database initialization failed:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return {
      success: false,
      error: message
    }
  }
}

// Run initialization if called directly
if (require.main === module) {
  initializeDatabase()
    .then((result) => {
      console.log('Initialization result:', result)
      process.exit(result.success ? 0 : 1)
    })
    .catch((error) => {
      console.error('Initialization failed:', error)
      process.exit(1)
    })
}
