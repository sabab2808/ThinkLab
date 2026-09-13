import { Rating } from '../models/Rating.js'
import { User } from '../models/User.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { AppError } from '../utils/AppError.js'

// GET /api/ratings/user/:username
export const getUserRatings = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
  if (!user) throw new AppError('User not found', 404)

  const ratings = await Rating.find({ user: user._id }).sort({ category: 1 })
  res.json({ username: user.username, ratings })
})

// GET /api/ratings/leaderboard/:category?limit=20
export const getLeaderboard = asyncHandler(async (req, res) => {
  const { category } = req.params
  const limit = Math.min(Number(req.query.limit) || 20, 100)

  const ratings = await Rating.find({ category })
    .sort({ rating: -1 })
    .limit(limit)
    .populate('user', 'username avatarUrl')

  res.json(
    ratings.map((r, i) => ({
      rank: i + 1,
      username: r.user.username,
      rating: Math.round(r.rating),
      gamesPlayed: r.gamesPlayed,
    })),
  )
})
