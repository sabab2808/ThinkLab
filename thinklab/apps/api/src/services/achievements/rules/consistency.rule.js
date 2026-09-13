const CONSISTENCY_THRESHOLD_GAMES = 10

export function consistencyRule(totalGamesPlayed) {
  return totalGamesPlayed >= CONSISTENCY_THRESHOLD_GAMES ? 'consistency' : null
}
