const MILESTONE_GAMES = 5

export function categoryMilestoneRule(gameSlug, rating) {
  if (gameSlug === 'maze' && rating.gamesPlayed >= MILESTONE_GAMES) return 'algorithm_master'
  if (gameSlug === 'tic-tac-toe' && rating.gamesPlayed >= MILESTONE_GAMES) return 'puzzle_master'
  return null
}
