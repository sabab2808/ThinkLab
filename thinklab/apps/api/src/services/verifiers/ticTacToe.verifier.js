import { createEmptyBoard, applyMove, checkWinner } from '@thinklab/game-engine'
import { elapsedMs } from './elapsedMs.js'

/**
 * Replays a Tic-Tac-Toe event log through the same pure board functions
 * the client uses. Rejects on an illegal move or a session finished
 * before the board reached a terminal state.
 *
 * For AI matches (session.opponentType === 'ai'), also determines the
 * human's actual outcome (win/draw/loss) from session.humanPlayer — this
 * is what makes a real Elo update possible; for local PvP there's no
 * second rated party, so `outcome` stays null.
 */
export function verifyTicTacToe(events, session) {
  let board = createEmptyBoard()

  try {
    for (const event of events) {
      if (event.eventType !== 'move') continue
      const { index, player } = event.eventData
      board = applyMove(board, index, player) // throws on an illegal move
    }
  } catch {
    return { verified: false, score: 0, moves: events.length, timeMs: elapsedMs(events), outcome: null }
  }

  const winner = checkWinner(board)
  if (!winner) {
    return { verified: false, score: 0, moves: events.length, timeMs: elapsedMs(events), outcome: null }
  }

  let outcome = null
  if (session.opponentType === 'ai') {
    if (winner === 'draw') outcome = 'draw'
    else outcome = winner === session.humanPlayer ? 'win' : 'loss'
  }

  return {
    verified: true,
    score: winner === 'draw' ? 0 : 1,
    moves: events.length,
    timeMs: elapsedMs(events),
    outcome,
  }
}
