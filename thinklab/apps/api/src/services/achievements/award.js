import { Achievement } from '../../models/Achievement.js'

/**
 * Awards `type` to `userId` if they don't already have it. Relies on the
 * unique (user, type) index on Achievement rather than a pre-check —
 * that makes this safe even if evaluateAchievements ever runs twice
 * concurrently for the same user.
 */
export async function awardAchievement(userId, type, resultId) {
  const res = await Achievement.updateOne(
    { user: userId, type },
    { $setOnInsert: { user: userId, type, result: resultId, issuedAt: new Date() } },
    { upsert: true },
  )
  return Boolean(res.upsertedCount)
}
