import { Rating } from '../models/Rating.js'
import { opponentRatingFor, eloDelta, OUTCOME_SCORE } from './elo.service.js'

const BASE_RATING = 1200

async function getOrCreateRating(userId, category) {
  let rating = await Rating.findOne({ user: userId, category })
  if (!rating) {
    rating = await Rating.create({ user: userId, category, rating: BASE_RATING, gamesPlayed: 0 })
  }
  return rating
}

/**
 * Performance-based rating update for games with no tracked opponent
 * (local PvP, solo puzzles like the Maze Lab). `delta` comes from
 * ratingDelta.js — see that file for why this isn't real Elo.
 */
export async function applyRatingUpdate(userId, category, delta) {
  const rating = await getOrCreateRating(userId, category)
  rating.rating += delta
  rating.gamesPlayed += 1
  await rating.save()
  return { rating, delta }
}

/**
 * REAL Elo update for a Tic-Tac-Toe match against a rated AI opponent —
 * a genuine two-party match with a known opponent rating, unlike the
 * placeholder formula above.
 */
export async function applyEloRatingUpdate(userId, category, outcome, difficulty) {
  const rating = await getOrCreateRating(userId, category)
  const opponentRating = opponentRatingFor(difficulty)
  const delta = eloDelta(rating.rating, opponentRating, OUTCOME_SCORE[outcome])

  rating.rating += delta
  rating.gamesPlayed += 1
  await rating.save()
  return { rating, delta }
}
