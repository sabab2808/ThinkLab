import mongoose from 'mongoose'

const gameSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', default: null },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned', 'flagged'],
    default: 'active',
  },
  // Only meaningful for head-to-head games (Tic-Tac-Toe). 'human' means
  // local PvP — there's no real second rated party, so it can't feed real
  // Elo (see docs/data-model.md). 'ai' means a real two-party match
  // against a fixed-rating opponent, which CAN produce a real Elo update.
  opponentType: { type: String, enum: ['human', 'ai'], default: 'human' },
  aiDifficulty: { type: String, enum: ['easy', 'medium', 'impossible'], default: null },
  humanPlayer: { type: String, enum: ['X', 'O'], default: null },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: null },
})

export const GameSession = mongoose.model('GameSession', gameSessionSchema)
