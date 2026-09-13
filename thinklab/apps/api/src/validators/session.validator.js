import { AppError } from '../utils/AppError.js'

const VALID_OPPONENT_TYPES = ['human', 'ai']
const VALID_AI_DIFFICULTIES = ['easy', 'medium', 'impossible']

export function validateCreateSession(body) {
  if (!body.gameSlug) throw new AppError('gameSlug is required', 400)

  if (body.opponentType !== undefined && !VALID_OPPONENT_TYPES.includes(body.opponentType)) {
    throw new AppError(`opponentType must be one of: ${VALID_OPPONENT_TYPES.join(', ')}`, 400)
  }
  if (body.opponentType === 'ai' && !VALID_AI_DIFFICULTIES.includes(body.aiDifficulty)) {
    throw new AppError(`aiDifficulty must be one of: ${VALID_AI_DIFFICULTIES.join(', ')}`, 400)
  }
}

export function validateEvent(body) {
  if (typeof body.sequenceNo !== 'number') {
    throw new AppError('sequenceNo must be a number', 400)
  }
  if (!body.eventType) throw new AppError('eventType is required', 400)
  if (body.eventData === undefined) throw new AppError('eventData is required', 400)
}
