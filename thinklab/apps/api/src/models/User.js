import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned by default — must opt in explicitly
    },
    avatarUrl: { type: String, default: null },
    verified: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
)

export const User = mongoose.model('User', userSchema)
