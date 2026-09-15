import { GameSession } from '../models/GameSession.js'
import { GameEvent } from '../models/GameEvent.js'
import { Game } from '../models/Game.js'
import { Result } from '../models/Result.js'
import { Proof } from '../models/Proof.js'
import { verifySession } from '../services/verification.service.js'
import { issueProof } from '../services/proof.service.js'
import { createMazeChallenge, createWordSearchChallenge } from '../services/challenge.service.js'
import { applyRatingUpdate, applyEloRatingUpdate } from '../services/rating.service.js'
import { ratingDelta } from '../services/ratingDelta.js'
import { evaluateAchievements } from '../services/achievements/index.js'
import { validateCreateSession, validateEvent } from '../validators/session.validator.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { AppError } from '../utils/AppError.js'

// POST /api/sessions — server owns the session id, challenge config, and
// (for AI matches) the opponent's fixed rating. The user comes from the
// verified JWT, never from the request body.
export const createSession = asyncHandler(async (req, res) => {
  validateCreateSession(req.body)
  const { gameSlug, opponentType = 'human', aiDifficulty, level } = req.body

  const game = await Game.findOne({ slug: gameSlug, active: true })
  if (!game) throw new AppError(`Unknown or inactive game "${gameSlug}"`, 404)

  // Maze and Word Search sessions need a fresh, seeded challenge
  // generated server-side — the client can't be trusted to pick its own
  // seed (for Word Search, that would mean picking its own grid).
  let challenge = null
  if (game.slug === 'maze') {
    challenge = await createMazeChallenge(game._id)
  } else if (game.slug === 'word-search') {
    const requestedLevel = Number.isInteger(level) && level > 0 ? level : 1
    challenge = await createWordSearchChallenge(game._id, requestedLevel)
  }

  const isAiMatch = game.slug === 'tic-tac-toe' && opponentType === 'ai'

  const session = await GameSession.create({
    user: req.user._id,
    game: game._id,
    challenge: challenge?._id || null,
    opponentType: isAiMatch ? 'ai' : 'human',
    aiDifficulty: isAiMatch ? aiDifficulty : null,
    humanPlayer: isAiMatch ? 'X' : null, // human always moves first against the AI
  })

  res.status(201).json({ session, challenge })
})

// GET /api/sessions/:id — session + its full event log + result, if any.
export const getSession = asyncHandler(async (req, res) => {
  const session = await GameSession.findById(req.params.id).populate('game').populate('challenge')
  if (!session) throw new AppError('Session not found', 404)

  const [events, result] = await Promise.all([
    GameEvent.find({ session: session._id }).sort({ sequenceNo: 1 }),
    Result.findOne({ session: session._id }),
  ])

  res.json({ session, events, result })
})

// POST /api/sessions/:id/events — append one validated event.
export const submitEvent = asyncHandler(async (req, res) => {
  validateEvent(req.body)
  const { id } = req.params
  const { sequenceNo, eventType, eventData } = req.body

  const session = await GameSession.findById(id)
  if (!session) throw new AppError('Session not found', 404)
  if (String(session.user) !== String(req.user._id)) {
    throw new AppError('You do not own this session', 403)
  }
  if (session.status !== 'active') {
    throw new AppError(`Cannot submit events to a ${session.status} session`, 409)
  }

  const event = await GameEvent.create({ session: id, sequenceNo, eventType, eventData })
  res.status(201).json(event)
})

// POST /api/sessions/:id/finish — deterministic replay, then rating
// update and achievement evaluation, then proof issuance. This is the
// trust boundary: nothing the client claimed about the outcome is used
// past this point.
export const finishSession = asyncHandler(async (req, res) => {
  const owningSession = await GameSession.findById(req.params.id)
  if (!owningSession) throw new AppError('Session not found', 404)
  if (String(owningSession.user) !== String(req.user._id)) {
    throw new AppError('You do not own this session', 403)
  }

  const { result, session, outcome } = await verifySession(req.params.id)

  let proof = null
  let rating = null
  let ratingDeltaValue = null
  let achievements = []

  if (result.verifiedStatus === 'verified') {
    proof = await Proof.findOne({ result: result._id })
    if (!proof) proof = await issueProof(result._id)

    // Real Elo for AI matches (a genuine two-party match with a known
    // opponent rating); the placeholder formula for everything else,
    // where there's no tracked opponent to compute an expected score
    // against — see docs/data-model.md for the full explanation.
    if (session.opponentType === 'ai' && outcome?.outcome) {
      ;({ rating, delta: ratingDeltaValue } = await applyEloRatingUpdate(
        req.user._id,
        session.game.category,
        outcome.outcome,
        session.aiDifficulty,
      ))
    } else {
      const delta = ratingDelta(session.game.slug, result)
      ;({ rating, delta: ratingDeltaValue } = await applyRatingUpdate(req.user._id, session.game.category, delta))
    }

    achievements = await evaluateAchievements({
      userId: req.user._id,
      gameSlug: session.game.slug,
      category: session.game.category,
      result,
      rating,
      outcome,
    })
  }

  res.json({
    result,
    proof,
    rating,
    ratingDelta: ratingDeltaValue,
    outcome: outcome?.outcome ?? null,
    passed: outcome?.passed ?? null,
    level: outcome?.level ?? null,
    wordsFound: outcome?.wordsFound ?? null,
    achievements,
  })
})
