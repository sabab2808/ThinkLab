import mongoose from 'mongoose'

const resultSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'GameSession', required: true, unique: true },
  // Denormalized from session.user — without this, "how many results has
  // this user ever verified" (needed by the achievement engine) requires
  // a GameSession join on every check. Worth the duplication.
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, default: null },
  timeMs: { type: Number, default: null },
  moves: { type: Number, default: null },
  efficiency: { type: Number, default: null }, // distance from best-known solution
  verifiedStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
})

export const Result = mongoose.model('Result', resultSchema)
