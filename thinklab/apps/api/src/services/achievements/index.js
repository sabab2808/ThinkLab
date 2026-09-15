import { countVerifiedResultsForUser, getCategoryRank, getTotalGamesPlayed } from './queries.js'
import { awardAchievement } from './award.js'
import { firstSolveRule } from './rules/firstSolve.rule.js'
import { speedDemonRule } from './rules/speedDemon.rule.js'
import { perfectStrategyRule } from './rules/perfectStrategy.rule.js'
import { categoryMilestoneRule } from './rules/categoryMilestone.rule.js'
import { levelMilestoneRule } from './rules/levelMilestone.rule.js'
import { percentileRule } from './rules/percentile.rule.js'
import { consistencyRule } from './rules/consistency.rule.js'

/**
 * Runs every achievement rule against the result of one verified session
 * and awards any that newly apply. Called once per verified `finish` —
 * see controllers/sessions.controller.js.
 *
 * `outcome` is the verifier's raw output (see verifiers/*.verifier.js) —
 * optional, only used by game-specific rules like levelMilestoneRule that
 * need fields (like Word Search's `level`) that don't live on the
 * persisted Result.
 *
 * Returns the array of achievement TYPES newly awarded this call (an
 * empty array if the user already had everything they qualify for).
 */
export async function evaluateAchievements({ userId, gameSlug, category, result, rating, outcome }) {
  const [totalVerified, { rank, total }, totalGamesPlayed] = await Promise.all([
    countVerifiedResultsForUser(userId),
    getCategoryRank(category, rating.rating),
    getTotalGamesPlayed(userId),
  ])

  const candidates = [
    firstSolveRule(totalVerified),
    speedDemonRule(gameSlug, result),
    perfectStrategyRule(gameSlug, result),
    categoryMilestoneRule(gameSlug, rating),
    levelMilestoneRule(gameSlug, outcome),
    consistencyRule(totalGamesPlayed),
    ...percentileRule(rank, total),
  ].filter(Boolean)

  const newlyAwarded = []
  for (const type of candidates) {
    const awarded = await awardAchievement(userId, type, result._id)
    if (awarded) newlyAwarded.push(type)
  }
  return newlyAwarded
}
