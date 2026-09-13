import { applyMove, checkWinner, legalMoves, otherPlayer } from './board.js'

/**
 * Scores a terminal board from `maximizingPlayer`'s point of view.
 *   +10  maximizingPlayer won
 *   -10  maximizingPlayer lost
 *    0   draw
 * Already done for you — minimax just needs somewhere to bottom out.
 */
function scoreTerminal(board, maximizingPlayer) {
  const winner = checkWinner(board)
  if (winner === maximizingPlayer) return 10
  if (winner === 'draw') return 0
  return -10
}

/**
 * Returns the best achievable SCORE for `maximizingPlayer` from this board
 * position, assuming `player` moves next and both sides play perfectly.
 *
 * `depth` counts how many plies deep this call is from the original
 * decision (bestMove's call). It's not needed for correctness — without
 * it the AI still never loses — but it's used to discount terminal scores
 * so the AI prefers a WIN sooner over a win later, and prefers to DELAY a
 * loss rather than walking into it early. Without this, an "impossible"
 * opponent can look like it's playing carelessly once the game is already
 * decided, because a win in 1 move and a win in 4 moves score identically.
 */
export function minimax(board, player, maximizingPlayer, depth = 0) {
  const winner = checkWinner(board)
  if (winner) {
    const score = scoreTerminal(board, maximizingPlayer)
    if (score > 0) return score - depth // win: prefer fewer moves to get there
    if (score < 0) return score + depth // loss: prefer more moves before it happens
    return score // draw: depth doesn't matter
  }

  const scores = legalMoves(board).map((index) => {
    const next = applyMove(board, index, player)
    return minimax(next, otherPlayer(player), maximizingPlayer, depth + 1)
  })

  return player === maximizingPlayer ? Math.max(...scores) : Math.min(...scores)
}

/**
 * Picks the best move index for `player` on `board` using minimax.
 * This one's done for you, but it only works once minimax() is real.
 */
export function bestMove(board, player) {
  let best = { index: -1, score: -Infinity }
  for (const index of legalMoves(board)) {
    const next = applyMove(board, index, player)
    const score = minimax(next, otherPlayer(player), player)
    if (score > best.score) {
      best = { index, score }
    }
  }
  return best.index
}
