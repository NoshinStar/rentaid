import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  { url: String, publicId: String },
  { _id: false }
)

const listingSchema = new mongoose.Schema(
  {
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    area: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    roomType: { type: String, enum: ['bachelor_flat', 'single_room', 'sublet'], required: true },
    rent: { type: Number, required: true, min: 0 },
    deposit: { type: Number, default: 0, min: 0 },
    bedrooms: { type: Number, default: 1, min: 0 },
    bathrooms: { type: Number, default: 1, min: 0 },
    sizeSqft: { type: Number, min: 0 },
    furnished: { type: Boolean, default: false },
    amenities: { type: [String], default: [] },
    images: { type: [imageSchema], default: [] },
    status: { type: String, enum: ['draft', 'active', 'rented', 'archived'], default: 'draft' },
  },
  { timestamps: true }
)

listingSchema.index({ status: 1, area: 1, roomType: 1, rent: 1 })
listingSchema.index({ createdAt: -1 })

export default mongoose.model('Listing', listingSchema)