import { Game } from '../models/Game.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const listGames = asyncHandler(async (req, res) => {
  const games = await Game.find({ active: true }).sort({ name: 1 })
  res.json(games)
})
