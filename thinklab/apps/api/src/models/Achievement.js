import mongoose from 'mongoose'

const achievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g. 'first_solve', 'top_10_percent'
  result: { type: mongoose.Schema.Types.ObjectId, ref: 'Result', default: null },
  issuedAt: { type: Date, default: Date.now },
})

// Enforced at the database level, not just in application logic — an
// upsert against this index is what makes awarding idempotent even under
// concurrent finish requests.
achievementSchema.index({ user: 1, type: 1 }, { unique: true })

export const Achievement = mongoose.model('Achievement', achievementSchema)
