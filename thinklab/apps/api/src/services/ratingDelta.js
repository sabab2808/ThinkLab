/**
 * How much a verified result should move a user's rating, per game slug.
 * Deliberately simple and documented as a placeholder: there's no
 * tracked opponent yet (Tic-Tac-Toe sessions are one authenticated user
 * playing both sides), so this is closer to "reward for a verified
 * result" than real Elo. True head-to-head rating needs matchmaking,
 * which isn't built yet — see docs/novelty.md.
 */
export function ratingDelta(gameSlug, result) {
  if (gameSlug === 'tic-tac-toe') {
    return result.score === 1 ? 10 : 5 // win : draw (loss isn't representable yet — see above)
  }

  if (gameSlug === 'maze') {
    const efficiency = result.efficiency ?? 0
    return Math.max(1, Math.round(efficiency * 25))
  }

  return 0
}
