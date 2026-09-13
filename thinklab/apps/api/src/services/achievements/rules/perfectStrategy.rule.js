export function perfectStrategyRule(gameSlug, result) {
  if (gameSlug === 'maze' && result.efficiency === 1) return 'perfect_strategy'
  if (gameSlug === 'tic-tac-toe' && result.score === 1 && result.moves <= 5) return 'perfect_strategy'
  return null
}
