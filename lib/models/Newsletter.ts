import mongoose, { Schema, model, Document } from 'mongoose'

export interface INewsletter extends Document {
  email: string
  status: 'active' | 'unsubscribed' | 'bounced'
  source?: string // 'footer', 'landing-page', etc.
  subscribedAt: Date
  unsubscribedAt?: Date
  lastEmailSent?: Date
  metadata?: {
    ipAddress?: string
    userAgent?: string
  }
  createdAt: Date
  updatedAt: Date
}

const NewsletterSchema = new Schema<INewsletter>({
  email: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true,
    unique: true,
    index: true
  },
  status: { 
    type: String, 
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  source: { 
    type: String, 
    default: 'footer'
  },
  subscribedAt: { 
    type: Date, 
    default: Date.now 
  },
  unsubscribedAt: { 
    type: Date 
  },
  lastEmailSent: { 
    type: Date 
  },
  metadata: {
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Indexes for better performance
NewsletterSchema.index({ email: 1 }, { unique: true })
NewsletterSchema.index({ status: 1 })
NewsletterSchema.index({ subscribedAt: -1 })
NewsletterSchema.index({ createdAt: -1 })

export const Newsletter = mongoose.models.Newsletter || model<INewsletter>('Newsletter', NewsletterSchema)

