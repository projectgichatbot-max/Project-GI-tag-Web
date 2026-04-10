import mongoose, { Schema, model, Document } from "mongoose"

export interface IContact extends Document {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  addressHint?: string
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    addressHint: { type: String, trim: true },
  },
  { timestamps: true, collection: "contacts" }
)

ContactSchema.index({ createdAt: -1 })
ContactSchema.index({ email: 1 })

export const Contact = mongoose.models.Contact || model<IContact>("Contact", ContactSchema)

