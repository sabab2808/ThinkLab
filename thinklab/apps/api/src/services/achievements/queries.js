import { Result } from '../../models/Result.js'
import { Rating } from '../../models/Rating.js'

export async function countVerifiedResultsForUser(userId) {
  return Result.countDocuments({ user: userId, verifiedStatus: 'verified' })
}

/** 1-indexed rank within a category by rating, plus the total player count. */
export async function getCategoryRank(category, ratingValue) {
  const [better, total] = await Promise.all([
    Rating.countDocuments({ category, rating: { $gt: ratingValue } }),
    Rating.countDocuments({ category }),
  ])
  return { rank: better + 1, total }
}

export async function getTotalGamesPlayed(userId) {
  const ratings = await Rating.find({ user: userId })
  return ratings.reduce((sum, r) => sum + r.gamesPlayed, 0)
}
