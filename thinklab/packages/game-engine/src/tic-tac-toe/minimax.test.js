import { describe, it, expect } from 'vitest'
import { applyMove, checkWinner, createEmptyBoard, PLAYER_X, PLAYER_O } from './board.js'
import { bestMove } from './minimax.js'

describe('bestMove', () => {
  it('takes the winning move when one is available', () => {
    // X X _
    // O O _
    // _ _ _
    let b = createEmptyBoard()
    b = applyMove(b, 0, PLAYER_X)
    b = applyMove(b, 3, PLAYER_O)
    b = applyMove(b, 1, PLAYER_X)
    b = applyMove(b, 4, PLAYER_O)
    expect(bestMove(b, PLAYER_X)).toBe(2)
  })

  it('blocks the opponent\'s winning move', () => {
    // O O _
    // X _ _
    // _ _ _
    let b = createEmptyBoard()
    b = applyMove(b, 0, PLAYER_O)
    b = applyMove(b, 3, PLAYER_X)
    b = applyMove(b, 1, PLAYER_O)
    expect(bestMove(b, PLAYER_X)).toBe(2)
  })

  it('never loses when playing itself from an empty board', () => {
    let board = createEmptyBoard()
    let player = PLAYER_X
    for (let i = 0; i < 9; i++) {
      const move = bestMove(board, player)
      if (move === -1) break
      board = applyMove(board, move, player)
      player = player === PLAYER_X ? PLAYER_O : PLAYER_X
      if (checkWinner(board)) break
    }
    // Perfect play from both sides on tic-tac-toe always draws.
    expect(checkWinner(board)).toBe('draw')
  })
})
