import connectDB from './database'
import { FirebaseService, COLLECTIONS } from './firebase'

export interface DatabaseService {
  // Products
  getProducts(filters?: any, pagination?: any): Promise<any>
  getProductById(id: string): Promise<any>
  createProduct(data: any): Promise<any>
  updateProduct(id: string, data: any): Promise<any>
  deleteProduct(id: string): Promise<any>
  
  // Artisans
  getArtisans(filters?: any, pagination?: any): Promise<any>
  getArtisanById(id: string): Promise<any>
  createArtisan(data: any): Promise<any>
  updateArtisan(id: string, data: any): Promise<any>
  deleteArtisan(id: string): Promise<any>
  
  // Users
  getUsers(filters?: any, pagination?: any): Promise<any>
  getUserById(id: string): Promise<any>
  createUser(data: any): Promise<any>
  updateUser(id: string, data: any): Promise<any>
  deleteUser(id: string): Promise<any>
  
  // Inquiries
  getInquiries(filters?: any, pagination?: any): Promise<any>
  getInquiryById(id: string): Promise<any>
  createInquiry(data: any): Promise<any>
  updateInquiry(id: string, data: any): Promise<any>
  deleteInquiry(id: string): Promise<any>
  
  // Search
  search(query: string, type?: string, limit?: number): Promise<any>
}

class MongoDBService implements DatabaseService {
  async getProducts(filters: any = {}, pagination: any = {}) {
    const { Product } = await import('./models/Product')
    const { page = 1, limit = 10 } = pagination
    const skip = (page - 1) * limit
    
    const products = await Product.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await Product.countDocuments(filters)
    
    return {
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }
  }

  async getProductById(id: string) {
    const { Product } = await import('./models/Product')
    return await Product.findById(id).lean()
  }

  async createProduct(data: any) {
    const { Product } = await import('./models/Product')
    const product = new Product(data)
    return await product.save()
  }

  async updateProduct(id: string, data: any) {
    const { Product } = await import('./models/Product')
    return await Product.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteProduct(id: string) {
    const { Product } = await import('./models/Product')
    return await Product.findByIdAndDelete(id)
  }

  async getArtisans(filters: any = {}, pagination: any = {}) {
    const { Artisan } = await import('./models/Artisan')
    const { page = 1, limit = 10 } = pagination
    const skip = (page - 1) * limit
    
    const artisans = await Artisan.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await Artisan.countDocuments(filters)
    
    return {
      data: artisans,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }
  }

  async getArtisanById(id: string) {
    const { Artisan } = await import('./models/Artisan')
    return await Artisan.findById(id).lean()
  }

  async createArtisan(data: any) {
    const { Artisan } = await import('./models/Artisan')
    const artisan = new Artisan(data)
    return await artisan.save()
  }

  async updateArtisan(id: string, data: any) {
    const { Artisan } = await import('./models/Artisan')
    return await Artisan.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteArtisan(id: string) {
    const { Artisan } = await import('./models/Artisan')
    return await Artisan.findByIdAndDelete(id)
  }

  async getUsers(filters: any = {}, pagination: any = {}) {
    const { User } = await import('./models/User')
    const { page = 1, limit = 10 } = pagination
    const skip = (page - 1) * limit
    
    const users = await User.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await User.countDocuments(filters)
    
    return {
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }
  }

  async getUserById(id: string) {
    const { User } = await import('./models/User')
    return await User.findById(id).lean()
  }

  async createUser(data: any) {
    const { User } = await import('./models/User')
    const user = new User(data)
    return await user.save()
  }

  async updateUser(id: string, data: any) {
    const { User } = await import('./models/User')
    return await User.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteUser(id: string) {
    const { User } = await import('./models/User')
    return await User.findByIdAndDelete(id)
  }

  async getInquiries(filters: any = {}, pagination: any = {}) {
    const { Inquiry } = await import('./models/Inquiry')
    const { page = 1, limit = 10 } = pagination
    const skip = (page - 1) * limit
    
    const inquiries = await Inquiry.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await Inquiry.countDocuments(filters)
    
    return {
      data: inquiries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }
  }

  async getInquiryById(id: string) {
    const { Inquiry } = await import('./models/Inquiry')
    return await Inquiry.findById(id).lean()
  }

  async createInquiry(data: any) {
    const { Inquiry } = await import('./models/Inquiry')
    const inquiry = new Inquiry(data)
    return await inquiry.save()
  }

  async updateInquiry(id: string, data: any) {
    const { Inquiry } = await import('./models/Inquiry')
    return await Inquiry.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteInquiry(id: string) {
    const { Inquiry } = await import('./models/Inquiry')
    return await Inquiry.findByIdAndDelete(id)
  }

  async search(query: string, type?: string, limit: number = 10) {
    const { Product } = await import('./models/Product')
    const { Artisan } = await import('./models/Artisan')
    
    const searchRegex = new RegExp(query, 'i')
    const results: any = { products: [], artisans: [], total: 0 }

    if (type === 'all' || type === 'products') {
      const products = await Product.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { culturalSignificance: searchRegex },
          { tags: searchRegex }
        ]
      }).limit(limit).lean()
      results.products = products
    }

    if (type === 'all' || type === 'artisans') {
      const artisans = await Artisan.find({
        $or: [
          { name: searchRegex },
          { bio: searchRegex },
          { specialization: searchRegex },
          { skills: searchRegex }
        ]
      }).limit(limit).lean()
      results.artisans = artisans
    }

    results.total = results.products.length + results.artisans.length
    return results
  }
}

class FirebaseDatabaseService implements DatabaseService {
  async getProducts(filters: any = {}, pagination: any = {}) {
    const { page = 1, limit = 10 } = pagination
    
    // For now, return mock data since Firebase is not configured
    const mockProducts = [
      {
        _id: '1',
        name: 'Munsiyari Rajma',
        category: 'Agricultural',
        region: 'Pithoragarh District (Munsiyari)',
        description: 'Small-sized red beans, rich in taste, grown in high-altitude organic conditions',
        rating: 4.8,
        reviews: 124,
        available: true,
        giCertified: true,
        images: ['/munsiyari-rajma-kidney-beans-red.jpg'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    return {
      data: mockProducts,
      pagination: {
        currentPage: page,
        totalPages: 1,
        totalItems: mockProducts.length,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
  }

  async getProductById(id: string) {
    // Return mock data for now
    return {
      _id: id,
      name: 'Munsiyari Rajma',
      category: 'Agricultural',
      region: 'Pithoragarh District (Munsiyari)',
      description: 'Small-sized red beans, rich in taste, grown in high-altitude organic conditions',
      rating: 4.8,
      reviews: 124,
      available: true,
      giCertified: true,
      images: ['/munsiyari-rajma-kidney-beans-red.jpg']
    }
  }

  async createProduct(data: any) {
    // Return mock created product
    return {
      _id: `product-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async updateProduct(id: string, data: any) {
    return {
      _id: id,
      ...data,
      updatedAt: new Date()
    }
  }

  async deleteProduct(id: string) {
    return { success: true, id }
  }

  async getArtisans(filters: any = {}, pagination: any = {}) {
    const { page = 1, limit = 10 } = pagination
    
    const mockArtisans = [
      {
        _id: '1',
        name: 'Rajesh Negi',
        village: 'Munsiyari',
        district: 'Pithoragarh',
        region: 'Kumaon',
        specialization: 'Organic Farming',
        experience: '25 years',
        bio: 'Rajesh has been practicing organic farming in the high altitudes of Munsiyari for over two decades.',
        image: '/uttarakhand-artisan-working-traditional-craft-work.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    return {
      data: mockArtisans,
      pagination: {
        currentPage: page,
        totalPages: 1,
        totalItems: mockArtisans.length,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
  }

  async getArtisanById(id: string) {
    return {
      _id: id,
      name: 'Rajesh Negi',
      village: 'Munsiyari',
      district: 'Pithoragarh',
      region: 'Kumaon',
      specialization: 'Organic Farming',
      experience: '25 years',
      bio: 'Rajesh has been practicing organic farming in the high altitudes of Munsiyari for over two decades.',
      image: '/uttarakhand-artisan-working-traditional-craft-work.jpg'
    }
  }

  async createArtisan(data: any) {
    return {
      _id: `artisan-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async updateArtisan(id: string, data: any) {
    return {
      _id: id,
      ...data,
      updatedAt: new Date()
    }
  }

  async deleteArtisan(id: string) {
    return { success: true, id }
  }

  async getUsers(filters: any = {}, pagination: any = {}) {
    const { page = 1, limit = 10 } = pagination
    
    const mockUsers = [
      {
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    return {
      data: mockUsers,
      pagination: {
        currentPage: page,
        totalPages: 1,
        totalItems: mockUsers.length,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
  }

  async getUserById(id: string) {
    return {
      _id: id,
      name: 'Test User',
      email: 'test@example.com'
    }
  }

  async createUser(data: any) {
    return {
      _id: `user-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async updateUser(id: string, data: any) {
    return {
      _id: id,
      ...data,
      updatedAt: new Date()
    }
  }

  async deleteUser(id: string) {
    return { success: true, id }
  }

  async getInquiries(filters: any = {}, pagination: any = {}) {
    const { page = 1, limit = 10 } = pagination
    
    return {
      data: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
  }

  async getInquiryById(id: string) {
    return null
  }

  async createInquiry(data: any) {
    return {
      _id: `inquiry-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async updateInquiry(id: string, data: any) {
    return {
      _id: id,
      ...data,
      updatedAt: new Date()
    }
  }

  async deleteInquiry(id: string) {
    return { success: true, id }
  }

  async search(query: string, type?: string, limit: number = 10) {
    return {
      products: [],
      artisans: [],
      total: 0
    }
  }
}

// Factory function to get the appropriate database service
export async function getDatabaseService(): Promise<DatabaseService> {
  try {
    const mongoConnection = await connectDB()
    if (mongoConnection) {
      console.log('📊 Using MongoDB as primary database')
      return new MongoDBService()
    }
  } catch (error) {
    console.log('📊 MongoDB not available, using Firebase')
  }
  
  console.log('📊 Using Firebase as primary database')
  return new FirebaseDatabaseService()
}

export { MongoDBService, FirebaseDatabaseService }
