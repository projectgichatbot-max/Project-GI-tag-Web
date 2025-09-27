import connectDB from './database'
import { FirebaseService, COLLECTIONS } from './firebase'
import { Product } from './models/Product'
import { Artisan } from './models/Artisan'
import { User } from './models/User'
import { Inquiry } from './models/Inquiry'

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
    return await Product.findById(id).lean()
  }

  async createProduct(data: any) {
    const product = new Product(data)
    return await product.save()
  }

  async updateProduct(id: string, data: any) {
    return await Product.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteProduct(id: string) {
    return await Product.findByIdAndDelete(id)
  }

  async getArtisans(filters: any = {}, pagination: any = {}) {
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
    return await Artisan.findById(id).lean()
  }

  async createArtisan(data: any) {
    const artisan = new Artisan(data)
    return await artisan.save()
  }

  async updateArtisan(id: string, data: any) {
    return await Artisan.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteArtisan(id: string) {
    return await Artisan.findByIdAndDelete(id)
  }

  async getUsers(filters: any = {}, pagination: any = {}) {
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
    return await User.findById(id).lean()
  }

  async createUser(data: any) {
    const user = new User(data)
    return await user.save()
  }

  async updateUser(id: string, data: any) {
    return await User.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteUser(id: string) {
    return await User.findByIdAndDelete(id)
  }

  async getInquiries(filters: any = {}, pagination: any = {}) {
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
    return await Inquiry.findById(id).lean()
  }

  async createInquiry(data: any) {
    const inquiry = new Inquiry(data)
    return await inquiry.save()
  }

  async updateInquiry(id: string, data: any) {
    return await Inquiry.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteInquiry(id: string) {
    return await Inquiry.findByIdAndDelete(id)
  }

  async search(query: string, type?: string, limit: number = 10) {
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
    
    // Convert MongoDB filters to Firebase filters
    const firebaseFilters = this.convertFilters(filters)
    
    const products = await FirebaseService.getDocuments(
      COLLECTIONS.PRODUCTS,
      firebaseFilters,
      limit,
      { field: 'createdAt', direction: 'desc' }
    )
    
    return {
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(products.length / limit),
        totalItems: products.length,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(products.length / limit),
        hasPrevPage: page > 1
      }
    }
  }

  async getProductById(id: string) {
    return await FirebaseService.getDocument(COLLECTIONS.PRODUCTS, id)
  }

  async createProduct(data: any) {
    return await FirebaseService.createDocument(COLLECTIONS.PRODUCTS, data)
  }

  async updateProduct(id: string, data: any) {
    return await FirebaseService.updateDocument(COLLECTIONS.PRODUCTS, id, data)
  }

  async deleteProduct(id: string) {
    return await FirebaseService.deleteDocument(COLLECTIONS.PRODUCTS, id)
  }

  async getArtisans(filters: any = {}, pagination: any = {}) {
    const { page = 1, limit = 10 } = pagination
    
    const firebaseFilters = this.convertFilters(filters)
    
    const artisans = await FirebaseService.getDocuments(
      COLLECTIONS.ARTISANS,
      firebaseFilters,
      limit,
      { field: 'createdAt', direction: 'desc' }
    )
    
    return {
      data: artisans,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(artisans.length / limit),
        totalItems: artisans.length,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(artisans.length / limit),
        hasPrevPage: page > 1
      }
    }
  }

  async getArtisanById(id: string) {
    return await FirebaseService.getDocument(COLLECTIONS.ARTISANS, id)
  }

  async createArtisan(data: any) {
    return await FirebaseService.createDocument(COLLECTIONS.ARTISANS, data)
  }

  async updateArtisan(id: string, data: any) {
    return await FirebaseService.updateDocument(COLLECTIONS.ARTISANS, id, data)
  }

  async deleteArtisan(id: string) {
    return await FirebaseService.deleteDocument(COLLECTIONS.ARTISANS, id)
  }

  async getUsers(filters: any = {}, pagination: any = {}) {
    const { page = 1, limit = 10 } = pagination
    
    const firebaseFilters = this.convertFilters(filters)
    
    const users = await FirebaseService.getDocuments(
      COLLECTIONS.USERS,
      firebaseFilters,
      limit,
      { field: 'createdAt', direction: 'desc' }
    )
    
    return {
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(users.length / limit),
        totalItems: users.length,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(users.length / limit),
        hasPrevPage: page > 1
      }
    }
  }

  async getUserById(id: string) {
    return await FirebaseService.getDocument(COLLECTIONS.USERS, id)
  }

  async createUser(data: any) {
    return await FirebaseService.createDocument(COLLECTIONS.USERS, data)
  }

  async updateUser(id: string, data: any) {
    return await FirebaseService.updateDocument(COLLECTIONS.USERS, id, data)
  }

  async deleteUser(id: string) {
    return await FirebaseService.deleteDocument(COLLECTIONS.USERS, id)
  }

  async getInquiries(filters: any = {}, pagination: any = {}) {
    const { page = 1, limit = 10 } = pagination
    
    const firebaseFilters = this.convertFilters(filters)
    
    const inquiries = await FirebaseService.getDocuments(
      COLLECTIONS.INQUIRIES,
      firebaseFilters,
      limit,
      { field: 'createdAt', direction: 'desc' }
    )
    
    return {
      data: inquiries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(inquiries.length / limit),
        totalItems: inquiries.length,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(inquiries.length / limit),
        hasPrevPage: page > 1
      }
    }
  }

  async getInquiryById(id: string) {
    return await FirebaseService.getDocument(COLLECTIONS.INQUIRIES, id)
  }

  async createInquiry(data: any) {
    return await FirebaseService.createDocument(COLLECTIONS.INQUIRIES, data)
  }

  async updateInquiry(id: string, data: any) {
    return await FirebaseService.updateDocument(COLLECTIONS.INQUIRIES, id, data)
  }

  async deleteInquiry(id: string) {
    return await FirebaseService.deleteDocument(COLLECTIONS.INQUIRIES, id)
  }

  async search(query: string, type?: string, limit: number = 10) {
    const results: any = { products: [], artisans: [], total: 0 }

    if (type === 'all' || type === 'products') {
      const products = await FirebaseService.searchDocuments(
        COLLECTIONS.PRODUCTS,
        query,
        ['name', 'description', 'culturalSignificance', 'tags'],
        limit
      )
      results.products = products
    }

    if (type === 'all' || type === 'artisans') {
      const artisans = await FirebaseService.searchDocuments(
        COLLECTIONS.ARTISANS,
        query,
        ['name', 'bio', 'specialization', 'skills'],
        limit
      )
      results.artisans = artisans
    }

    results.total = results.products.length + results.artisans.length
    return results
  }

  private convertFilters(filters: any) {
    const firebaseFilters: any[] = []
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === '$or') {
          // Handle OR conditions - Firebase doesn't support OR directly
          // This is a simplified implementation
          return
        } else if (typeof value === 'object' && value.$regex) {
          // Handle regex - Firebase doesn't support regex
          return
        } else {
          firebaseFilters.push({
            field: key,
            operator: '==',
            value: value
          })
        }
      }
    })
    
    return firebaseFilters
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
  return new FirebaseService()
}

export { MongoDBService, FirebaseService }
