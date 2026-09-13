import mongoose from 'mongoose'

const challengeSchema = new mongoose.Schema({
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  difficulty: { type: String, default: 'standard' },
  config: { type: mongoose.Schema.Types.Mixed, default: {} }, // seed, board size, etc.
  version: { type: String, default: '1.0.0' },
})

export const Challenge = mongoose.model('Challenge', challengeSchema)
