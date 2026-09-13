import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // e.g. 'tic-tac-toe'
  name: { type: String, required: true },
  category: { type: String, required: true },
  version: { type: String, default: '1.0.0' },
  active: { type: Boolean, default: true },
})

export const Game = mongoose.model('Game', gameSchema)
