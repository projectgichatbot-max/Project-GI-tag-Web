import { Schema, model, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  category: string
  region: string
  description: string
  longDescription?: string
  healthBenefits: string[]
  culturalSignificance: string
  images: string[] // Cloudinary URLs
  cloudinaryPublicIds: string[] // For deletion/updates
  rating: number
  reviewsCount: number
  culturalValue: string
  available: boolean
  giCertified: boolean
  giRegistrationNumber?: string
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
  reviews: Array<{
    id: string
    user: string
    rating: number
    comment: string
    date: Date
  }>
  tags: string[]
  keywords: string[]
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  region: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  healthBenefits: [{ type: String }],
  culturalSignificance: { type: String, required: true },
  images: [{ type: String }], // Cloudinary URLs
  cloudinaryPublicIds: [{ type: String }], // For deletion/updates
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  culturalValue: { type: String, required: true },
  available: { type: Boolean, default: true },
  giCertified: { type: Boolean, default: false },
  giRegistrationNumber: { type: String },
  artisan: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    village: { type: String, required: true },
    district: { type: String, required: true },
    experience: { type: String, required: true },
    specialization: { type: String, required: true },
    contact: { type: String, required: true },
    bio: { type: String, required: true }
  },
  nutritionalInfo: {
    protein: String,
    carbs: String,
    fiber: String,
    iron: String,
    calcium: String,
    calories: String
  },
  harvestSeason: { type: String },
  shelfLife: { type: String },
  storageInstructions: { type: String },
  careInstructions: { type: String },
  dimensions: { type: String },
  materials: { type: String },
  cookingInstructions: [{ type: String }],
  seasonality: { type: String },
  reviews: [{
    id: { type: String, required: true },
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  tags: [{ type: String }],
  keywords: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Indexes for better performance
ProductSchema.index({ name: 'text', description: 'text', culturalSignificance: 'text' })
ProductSchema.index({ category: 1 })
ProductSchema.index({ region: 1 })
ProductSchema.index({ giCertified: 1 })
ProductSchema.index({ available: 1 })

export const Product = model<IProduct>('Product', ProductSchema)
