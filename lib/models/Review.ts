import mongoose, { Schema, model, Document } from "mongoose"

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId | string
  user: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
)

ReviewSchema.index({ productId: 1, createdAt: -1 })

export const Review = mongoose.models.Review || model<IReview>("Review", ReviewSchema)

