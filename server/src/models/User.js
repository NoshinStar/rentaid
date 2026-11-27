import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ["tenant", "landlord"], default: "tenant" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model("User", userSchema)