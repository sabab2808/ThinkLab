import { describe, it, expect } from 'vitest'
import {
  createEmptyBoard,
  applyMove,
  checkWinner,
  legalMoves,
  PLAYER_X,
  PLAYER_O,
} from './board.js'

describe('createEmptyBoard', () => {
  it('returns 9 empty cells', () => {
    expect(createEmptyBoard()).toEqual(Array(9).fill(null))
  })
})

describe('applyMove', () => {
  it('places the player mark without mutating the original board', () => {
    const board = createEmptyBoard()
    const next = applyMove(board, 4, PLAYER_X)
    expect(next[4]).toBe(PLAYER_X)
    expect(board[4]).toBe(null) // original untouched
  })

  it('throws on an occupied cell', () => {
    const board = applyMove(createEmptyBoard(), 0, PLAYER_X)
    expect(() => applyMove(board, 0, PLAYER_O)).toThrow(/Illegal move/)
  })
})

describe('checkWinner', () => {
  it('detects a row win', () => {
    let b = createEmptyBoard()
    b = applyMove(b, 0, PLAYER_X)
    b = applyMove(b, 1, PLAYER_X)
    b = applyMove(b, 2, PLAYER_X)
    expect(checkWinner(b)).toBe(PLAYER_X)
  })

  it('detects a diagonal win', () => {
    let b = createEmptyBoard()
    b = applyMove(b, 0, PLAYER_O)
    b = applyMove(b, 4, PLAYER_O)
    b = applyMove(b, 8, PLAYER_O)
    expect(checkWinner(b)).toBe(PLAYER_O)
  })

  it('returns null while the game is still in progress', () => {
    const b = applyMove(createEmptyBoard(), 0, PLAYER_X)
    expect(checkWinner(b)).toBe(null)
  })

  it('returns "draw" when the board is full with no winner', () => {
    // X O X
    // X O O
    // O X X
    const moves = [
      [0, PLAYER_X], [1, PLAYER_O], [2, PLAYER_X],
      [4, PLAYER_O], [3, PLAYER_X], [5, PLAYER_O],
      [7, PLAYER_X], [6, PLAYER_O], [8, PLAYER_X],
    ]
    let b = createEmptyBoard()
    for (const [i, p] of moves) b = applyMove(b, i, p)
    expect(checkWinner(b)).toBe('draw')
  })
})

describe('legalMoves', () => {
  it('lists only empty cell indices', () => {
    const b = applyMove(createEmptyBoard(), 4, PLAYER_X)
    expect(legalMoves(b)).toEqual([0, 1, 2, 3, 5, 6, 7, 8])
  })
})
