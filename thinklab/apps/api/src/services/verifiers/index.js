import { verifyTicTacToe } from './ticTacToe.verifier.js'
import { verifyMaze } from './maze.verifier.js'
import { verifyWordSearch } from './wordSearch.verifier.js'

// One verifier per game slug. Each takes (events, session) and returns
// { verified, score, moves, timeMs, efficiency? }. Adding a new game
// means adding one entry here and one file in this folder — the
// session/result plumbing in verification.service.js doesn't change.
export const verifiers = {
  'tic-tac-toe': verifyTicTacToe,
  maze: verifyMaze,
  'word-search': verifyWordSearch,
}
