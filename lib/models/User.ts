import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  preferences: {
    language: string
    region: string
    interests: string[]
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
  culturalInterests: string[]
  learningProgress: {
    completedCourses: string[]
    currentCourses: string[]
    achievements: string[]
    points: number
    level: string
  }
  savedHeritageItems: string[] // Product IDs
  reviews: Array<{
    id: string
    productId: string
    rating: number
    comment: string
    date: Date
  }>
  profile: {
    avatar?: string // Cloudinary URL
    cloudinaryPublicId?: string
    bio?: string
    location?: string
    phone?: string
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  activity: Array<{
    type: string
    description: string
    date: Date
    metadata?: any
  }>
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  preferences: {
    language: { type: String, default: 'en' },
    region: { type: String, default: 'all' },
    interests: [{ type: String }],
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  },
  culturalInterests: [{ type: String }],
  learningProgress: {
    completedCourses: [{ type: String }],
    currentCourses: [{ type: String }],
    achievements: [{ type: String }],
    points: { type: Number, default: 0 },
    level: { type: String, default: 'Beginner' }
  },
  savedHeritageItems: [{ type: String }], // Product IDs
  reviews: [{
    id: { type: String, required: true },
    productId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  profile: {
    avatar: String, // Cloudinary URL
    cloudinaryPublicId: String,
    bio: String,
    location: String,
    phone: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  activity: [{
    type: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    metadata: Schema.Types.Mixed
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Indexes for better performance
UserSchema.index({ email: 1 })
UserSchema.index({ 'preferences.interests': 1 })
UserSchema.index({ 'learningProgress.level': 1 })

export const User = model<IUser>('User', UserSchema)
