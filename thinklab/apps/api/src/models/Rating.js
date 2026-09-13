import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true }, // e.g. 'strategy', 'pathfinding'
    rating: { type: Number, default: 1200 },
    gamesPlayed: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: 'updatedAt' } },
)

ratingSchema.index({ user: 1, category: 1 }, { unique: true })

export const Rating = mongoose.model('Rating', ratingSchema)
