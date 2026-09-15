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

  if (gameSlug === 'word-search') {
    // Proportional to the round's raw score, capped so a single very
    // high-level round can't swing the rating too far in one go. Higher
    // levels naturally score higher (longer words are worth more) AND
    // have higher cutoffs to reach, so this scales reasonably with
    // difficulty even without the delta formula knowing the level
    // directly.
    return Math.min(20, Math.max(1, Math.round(result.score / 3)))
  }

  return 0
}
