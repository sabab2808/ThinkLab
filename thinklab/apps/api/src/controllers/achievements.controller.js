import { Achievement } from '../models/Achievement.js'
import { User } from '../models/User.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { AppError } from '../utils/AppError.js'

// GET /api/achievements/user/:username
export const getUserAchievements = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
  if (!user) throw new AppError('User not found', 404)

  const achievements = await Achievement.find({ user: user._id }).sort({ issuedAt: -1 })
  res.json({ username: user.username, achievements })
})
