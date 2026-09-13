import { describe, it, expect } from 'vitest'
import { createEmptyBoard, applyMove, legalMoves, PLAYER_X, PLAYER_O } from './board.js'
import { pickAiMove } from './aiOpponent.js'
import { bestMove } from './minimax.js'

describe('pickAiMove', () => {
  it('impossible always matches bestMove', () => {
    let b = createEmptyBoard()
    b = applyMove(b, 0, PLAYER_X)
    b = applyMove(b, 4, PLAYER_O)
    expect(pickAiMove(b, PLAYER_X, 'impossible')).toBe(bestMove(b, PLAYER_X))
  })

  it('easy always returns a legal move', () => {
    const b = applyMove(createEmptyBoard(), 4, PLAYER_X)
    for (let i = 0; i < 20; i++) {
      const move = pickAiMove(b, PLAYER_O, 'easy')
      expect(legalMoves(b)).toContain(move)
    }
  })

  it('medium always returns a legal move', () => {
    const b = applyMove(createEmptyBoard(), 4, PLAYER_X)
    for (let i = 0; i < 20; i++) {
      const move = pickAiMove(b, PLAYER_O, 'medium')
      expect(legalMoves(b)).toContain(move)
    }
  })

  it('easy is not always optimal (statistically, over many trials)', () => {
    // From this position, the unique optimal move is 2 (win immediately).
    // "Easy" picking it every single time across many trials would mean
    // it isn't actually random.
    let b = createEmptyBoard()
    b = applyMove(b, 0, PLAYER_X)
    b = applyMove(b, 3, PLAYER_O)
    b = applyMove(b, 1, PLAYER_X)
    const optimal = bestMove(b, PLAYER_X)

    const moves = Array.from({ length: 30 }, () => pickAiMove(b, PLAYER_X, 'easy'))
    expect(moves.some((m) => m !== optimal)).toBe(true)
  })
})
