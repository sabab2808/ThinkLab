import { legalMoves } from './board.js'
import { bestMove } from './minimax.js'

function randomMove(board) {
  const moves = legalMoves(board)
  return moves[Math.floor(Math.random() * moves.length)]
}

/**
 * Picks the AI's move for a given difficulty:
 *   easy       — always random among legal moves
 *   medium     — a coin flip between optimal and random each turn
 *   impossible — always optimal (bestMove / minimax)
 *
 * This is what a "difficulty level" actually has to mean for an Elo
 * opponent rating to be honest — a fixed rating for "easy" only makes
 * sense if "easy" reliably plays worse than optimal.
 */
export function pickAiMove(board, player, difficulty = 'impossible') {
  if (difficulty === 'easy') return randomMove(board)
  if (difficulty === 'medium') return Math.random() < 0.5 ? bestMove(board, player) : randomMove(board)
  return bestMove(board, player)
}
