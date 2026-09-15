const DEEP_LEVEL_THRESHOLD = 10

/**
 * Word Search-specific: unlike the other games, it has an unlimited
 * level ladder rather than a fixed win condition, so "reached a deep
 * level" is its own kind of achievement, distinct from the generic
 * category-milestone (games played) rule.
 */
export function levelMilestoneRule(gameSlug, outcome) {
  if (gameSlug !== 'word-search') return null
  if (!outcome?.passed) return null
  if ((outcome.level ?? 0) >= DEEP_LEVEL_THRESHOLD) return 'vocabulary_virtuoso'
  return null
}
