import { Schema, model, Document } from 'mongoose'

export interface IArtisan extends Document {
  name: string
  village: string
  district: string
  region: string
  specialization: string
  experience: string
  bio: string
  image: string // Cloudinary URL
  cloudinaryPublicId: string // For deletion/updates
  products: string[] // Product IDs
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
    date: Date
  }>
  gallery: string[] // Cloudinary URLs for additional images
  cloudinaryGalleryIds: string[] // For deletion/updates
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
  createdAt: Date
  updatedAt: Date
}

const ArtisanSchema = new Schema<IArtisan>({
  name: { type: String, required: true, trim: true },
  village: { type: String, required: true },
  district: { type: String, required: true },
  region: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary URL
  cloudinaryPublicId: { type: String, required: true },
  products: [{ type: String }], // Product IDs
  skills: [{ type: String }],
  achievements: [{ type: String }],
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String },
    address: { type: String, required: true }
  },
  workshopsOffered: [{
    title: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    maxParticipants: { type: Number, default: 10 },
    available: { type: Boolean, default: true }
  }],
  availability: { type: String, required: true },
  languages: [{ type: String }],
  certifications: [{ type: String }],
  socialImpact: {
    familiesSupported: { type: Number, default: 0 },
    studentsTrained: { type: Number, default: 0 },
    culturalEvents: { type: Number, default: 0 },
    communityProjects: { type: Number, default: 0 }
  },
  testimonials: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  gallery: [{ type: String }], // Cloudinary URLs
  cloudinaryGalleryIds: [{ type: String }],
  socialMedia: {
    facebook: String,
    instagram: String,
    youtube: String,
    website: String
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
  },
  tags: [{ type: String }],
  keywords: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Indexes for better performance
ArtisanSchema.index({ name: 'text', bio: 'text', specialization: 'text' })
ArtisanSchema.index({ village: 1 })
ArtisanSchema.index({ district: 1 })
ArtisanSchema.index({ region: 1 })
ArtisanSchema.index({ specialization: 1 })

export const Artisan = model<IArtisan>('Artisan', ArtisanSchema)
