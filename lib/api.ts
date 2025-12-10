

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface Product {
  _id: string
  name: string
  category: string
  region: string
  description: string
  longDescription?: string
  healthBenefits: string[]
  culturalSignificance: string
  images: string[]
  rating: number
  reviewsCount: number
  reviews?: Array<{
    id: string
    user: string
    rating: number
    comment: string
    date: string
  }>
  culturalValue: string
  available: boolean
  giCertified: boolean
  giRegistrationNumber?: string
  recipes?: Recipe[]
  artisan: {
    id: string
    name: string
    village: string
    district: string
    experience: string
    specialization: string
    contact: string
    bio: string
  }
  nutritionalInfo?: {
    protein: string
    carbs: string
    fiber: string
    iron: string
    calcium: string
    calories: string
  }
  harvestSeason?: string
  shelfLife?: string
  storageInstructions?: string
  careInstructions?: string
  dimensions?: string
  materials?: string
  cookingInstructions?: string[]
  seasonality?: string
  tags: string[]
  keywords: string[]
  createdAt: string
  updatedAt: string
}

export interface Recipe {
  title: string
  summary?: string
  prepTime?: string
  cookTime?: string
  serves?: string
  ingredients: string[]
  steps: string[]
}

export interface Artisan {
  _id: string
  name: string
  village: string
  district: string
  region: string
  specialization: string
  experience: string
  bio: string
  image: string
  products: string[]
  skills: string[]
  achievements: string[]
  contact: {
    phone: string
    email: string
    whatsapp: string
    address: string
  }
  workshopsOffered: Array<{
    title: string
    duration: string
    price: number
    description: string
    maxParticipants: number
    available: boolean
  }>
  availability: string
  languages: string[]
  certifications: string[]
  socialImpact: {
    familiesSupported: number
    studentsTrained: number
    culturalEvents: number
    communityProjects: number
  }
  testimonials: Array<{
    id: string
    name: string
    rating: number
    comment: string
    date: string
  }>
  gallery: string[]
  socialMedia: {
    facebook?: string
    instagram?: string
    youtube?: string
    website?: string
  }
  location: {
    latitude: number
    longitude: number
    address: string
  }
  tags: string[]
  keywords: string[]
  createdAt: string
  updatedAt: string
}

// Products API
export const productsApi = {
  async getAll(params?: {
    page?: number
    limit?: number
    category?: string
    region?: string
    search?: string
    giCertified?: boolean
    available?: boolean
  }): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.category) searchParams.set('category', params.category)
    if (params?.region) searchParams.set('region', params.region)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.giCertified !== undefined) searchParams.set('giCertified', params.giCertified.toString())
    if (params?.available !== undefined) searchParams.set('available', params.available.toString())
    
    const response = await fetch(`/api/products?${searchParams.toString()}`)
    return response.json()
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    const response = await fetch(`/api/products/${id}`)
    return response.json()
  },

  async addReview(id: string, payload: { user?: string; rating: number; comment: string }): Promise<ApiResponse<Product>> {
    const response = await fetch(`/api/products/${id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    return response.json()
  },

  async create(product: Partial<Product>): Promise<ApiResponse<Product>> {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    return response.json()
  },

  async update(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    return response.json()
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

// Artisans API
export const artisansApi = {
  async getAll(params?: {
    page?: number
    limit?: number
    region?: string
    specialization?: string
    search?: string
    village?: string
  }): Promise<ApiResponse<Artisan[]>> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.region) searchParams.set('region', params.region)
    if (params?.specialization) searchParams.set('specialization', params.specialization)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.village) searchParams.set('village', params.village)
    
    const response = await fetch(`/api/artisans?${searchParams.toString()}`)
    return response.json()
  },

  async getById(id: string): Promise<ApiResponse<Artisan>> {
    const response = await fetch(`/api/artisans/${id}`)
    return response.json()
  },

  async create(artisan: Partial<Artisan>): Promise<ApiResponse<Artisan>> {
    const response = await fetch('/api/artisans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artisan),
    })
    return response.json()
  },

  async update(id: string, artisan: Partial<Artisan>): Promise<ApiResponse<Artisan>> {
    const response = await fetch(`/api/artisans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artisan),
    })
    return response.json()
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`/api/artisans/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

// Search API
export const searchApi = {
  async search(query: string, type?: 'all' | 'products' | 'artisans', limit?: number): Promise<ApiResponse<{
    products: Product[]
    artisans: Artisan[]
    total: number
  }>> {
    const searchParams = new URLSearchParams()
    searchParams.set('q', query)
    if (type) searchParams.set('type', type)
    if (limit) searchParams.set('limit', limit.toString())
    
    const response = await fetch(`/api/search?${searchParams.toString()}`)
    return response.json()
  }
}

// Upload API
export const uploadApi = {
  async uploadFile(file: File, type: 'product' | 'artisan' | 'user' | 'gallery' | 'document', folder?: string): Promise<ApiResponse<{
    publicId: string
    url: string
    width: number
    height: number
    format: string
    bytes: number
  }>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    if (folder) formData.append('folder', folder)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    return response.json()
  },

  async deleteFile(publicId: string): Promise<ApiResponse<void>> {
    const response = await fetch(`/api/upload?publicId=${publicId}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

// Contact API
export const contactApi = {
  async submitInquiry(data: {
    name: string
    email: string
    subject?: string
    message: string
    inquiryType?: string
  }): Promise<ApiResponse<{
    id: string
    status: string
    message: string
    estimatedResponse: string
    ticketNumber: string
  }>> {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }
}
