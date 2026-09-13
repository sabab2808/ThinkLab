// Pure game logic for Tic-Tac-Toe.
// No React, no DOM, no network — this is what gets unit tested and what
// the server re-runs to verify a session actually happened the way the
// client claims it did.

export const EMPTY = null
export const PLAYER_X = 'X'
export const PLAYER_O = 'O'

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],           // diagonals
]

export function createEmptyBoard() {
  return Array(9).fill(EMPTY)
}

export function legalMoves(board) {
  return board.reduce((moves, cell, i) => {
    if (cell === EMPTY) moves.push(i)
    return moves
  }, [])
}

/**
 * Returns a NEW board with the move applied. Never mutates the input —
 * the verification engine replays a whole history of these, so shared
 * mutable state would corrupt earlier snapshots.
 */
export function applyMove(board, index, player) {
  if (board[index] !== EMPTY) {
    throw new Error(`Illegal move: cell ${index} is already occupied`)
  }
  const next = board.slice()
  next[index] = player
  return next
}

/**
 * Returns 'X', 'O', 'draw', or null (game still in progress).
 */
export function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  if (legalMoves(board).length === 0) return 'draw'
  return null
}

export function otherPlayer(player) {
  return player === PLAYER_X ? PLAYER_O : PLAYER_X
}
