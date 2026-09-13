// Standard Elo. AI opponents get a fixed rating per difficulty — that's
// what makes this a REAL two-party match, unlike PvP or solo puzzles
// where there's no second rated party to compute an expected score
// against (see ratingDelta.js for how those are handled instead).
const K_FACTOR = 32

const AI_RATING = {
  easy: 900,
  medium: 1300,
  impossible: 1900,
}

export function opponentRatingFor(difficulty) {
  return AI_RATING[difficulty] ?? AI_RATING.medium
}

export function expectedScore(ratingA, ratingB) {
  return 1 / (1 + 10 ** ((ratingB - ratingA) / 400))
}

export function eloDelta(userRating, opponentRating, actualScore) {
  const expected = expectedScore(userRating, opponentRating)
  return Math.round(K_FACTOR * (actualScore - expected))
}

export const OUTCOME_SCORE = { win: 1, draw: 0.5, loss: 0 }
