// Skip awarding percentile achievements until a category has enough
// players for "top 10%" to mean something rather than "you're one of
// three people who've played this."
const MIN_PLAYERS_FOR_PERCENTILE = 5

export function percentileRule(rank, total) {
  if (total < MIN_PLAYERS_FOR_PERCENTILE) return []

  const percentile = (rank / total) * 100
  const types = []
  if (percentile <= 10) types.push('top_10_percent')
  if (percentile <= 1) types.push('top_1_percent')
  return types
}
