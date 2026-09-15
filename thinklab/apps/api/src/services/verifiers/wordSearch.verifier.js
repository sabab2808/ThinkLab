import { generateGrid, getLineCells, extractWord, matchWord, scoreForWord, INVALID_PENALTY, cutoffScoreFor, timeLimitFor } from '@thinklab/word-search'
import { AppError } from '../../utils/AppError.js'
import { elapsedMs } from './elapsedMs.js'

/**
 * Regenerates the level's grid from the session's stored (level, seed) —
 * the same deterministic generator the client used to render it — then
 * independently re-derives and re-validates every word the client claims
 * to have found. The client's own "valid"/"score" claims in the event
 * payload are never trusted; only the cell coordinates it selected are,
 * and even those are checked against the server's own grid and the
 * server's own dictionary.
 */
export function verifyWordSearch(events, session) {
  if (!session.challenge?.config?.level) {
    throw new AppError('Word Search session is missing challenge config', 500)
  }

  const { level, seed } = session.challenge.config
  const grid = generateGrid(level, seed)

  let score = 0
  const foundWords = new Set()

  for (const event of events) {
    if (event.eventType !== 'select') continue
    const { startRow, startCol, endRow, endCol } = event.eventData

    const cells = getLineCells({ row: startRow, col: startCol }, { row: endRow, col: endCol })
    if (!cells) continue // not a straight line — malformed/ignored, not scored

    const word = extractWord(grid, cells)
    if (word.length < 3) continue

    const matchedWord = matchWord(word)
    if (matchedWord && !foundWords.has(matchedWord)) {
      foundWords.add(matchedWord)
      score += scoreForWord(word)
    }
    // Invalid guesses never subtract points; they are simply ignored.
  }

  score = Math.max(0, score)

  const timeMs = elapsedMs(events)
  const timeLimitMs = timeLimitFor(level) * 1000
  const withinTime = timeMs <= timeLimitMs + 5000 // small grace for network latency

  const cutoff = cutoffScoreFor(level)
  const passed = score >= cutoff && withinTime

  return {
    verified: withinTime,
    score,
    moves: foundWords.size,
    timeMs,
    efficiency: null,
    passed,
    level,
    wordsFound: foundWords.size,
  }
}
