import { GameEvent } from '../models/GameEvent.js'
import { GameSession } from '../models/GameSession.js'
import { Result } from '../models/Result.js'
import { AppError } from '../utils/AppError.js'
import { verifiers } from './verifiers/index.js'

/**
 * Loads a session's full event log, replays it deterministically through
 * the appropriate game verifier, and writes an authoritative Result.
 * Nothing the client claimed about the outcome is trusted — every field
 * is recomputed here from the event log (and, for maze, the challenge
 * seed; for AI matches, the session's opponent info) alone.
 *
 * Returns { result, session, outcome } — `outcome` is the verifier's raw
 * output (includes AI win/draw/loss for Tic-Tac-Toe) for the controller
 * to use in rating logic, without needing every game's bespoke fields to
 * live on the Result schema itself.
 */
export async function verifySession(sessionId) {
  const session = await GameSession.findById(sessionId).populate('game').populate('challenge')
  if (!session) throw new AppError('Session not found', 404)
  if (session.status === 'completed') {
    throw new AppError('Session has already been verified', 409)
  }

  const events = await GameEvent.find({ session: sessionId }).sort({ sequenceNo: 1 })
  if (events.length === 0) {
    throw new AppError('Cannot verify a session with no events', 400)
  }

  const verify = verifiers[session.game.slug]
  if (!verify) {
    throw new AppError(`No verifier registered for game "${session.game.slug}"`, 501)
  }

  const outcome = verify(events, session)

  session.status = outcome.verified ? 'completed' : 'flagged'
  session.endedAt = new Date()
  await session.save()

  const result = await Result.findOneAndUpdate(
    { session: sessionId },
    {
      session: sessionId,
      user: session.user,
      score: outcome.score,
      timeMs: outcome.timeMs,
      moves: outcome.moves,
      efficiency: outcome.efficiency ?? null,
      verifiedStatus: outcome.verified ? 'verified' : 'rejected',
    },
    { upsert: true, new: true },
  )

  return { result, session, outcome }
}
