import { Schema, model, Document } from 'mongoose'

export interface IInquiry extends Document {
  name: string
  email: string
  subject: string
  message: string
  inquiryType: string
  status: 'pending' | 'in-progress' | 'resolved' | 'closed'
  response?: string
  assignedTo?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  tags: string[]
  attachments?: string[] // Cloudinary URLs
  cloudinaryAttachmentIds?: string[]
  followUpDate?: Date
  notes: Array<{
    id: string
    content: string
    author: string
    date: Date
  }>
  createdAt: Date
  updatedAt: Date
}

const InquirySchema = new Schema<IInquiry>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  inquiryType: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  response: { type: String },
  assignedTo: { type: String },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [{ type: String }],
  attachments: [{ type: String }], // Cloudinary URLs
  cloudinaryAttachmentIds: [{ type: String }],
  followUpDate: { type: Date },
  notes: [{
    id: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Indexes for better performance
InquirySchema.index({ status: 1 })
InquirySchema.index({ priority: 1 })
InquirySchema.index({ inquiryType: 1 })
InquirySchema.index({ createdAt: -1 })

export const Inquiry = model<IInquiry>('Inquiry', InquirySchema)
