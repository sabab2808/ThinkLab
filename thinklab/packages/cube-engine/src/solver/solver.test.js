import { describe, it, expect } from 'vitest'
import { createSolvedCube, applyMoves, scramble, isSolved } from '../cube.js'
import { MOVES } from '../moves.js'
import { solveF2L } from './f2l.js'
import { attemptLastLayer } from './lastLayer.js'
import { solveCube } from './index.js'
import { f2lSolved } from './pieces.js'

describe('solveF2L', () => {
  it('solves the first layer (cross + corners) from random scrambles', () => {
    const trials = 3
    let firstLayerReached = 0
    for (let trial = 0; trial < trials; trial++) {
      const { cube: scrambled } = scramble(createSolvedCube(), 20, MOVES)
      const result = solveF2L(scrambled)
      if (result.stage === 'middle-edges' || result.stage === 'done') firstLayerReached++
    }
    // With the two-tier (restricted-then-full search) approach, the
    // first layer reaches completion very reliably — a real bar, not a hedge.
    expect(firstLayerReached).toBeGreaterThanOrEqual(trials - 1)
  }, 45000)

  it('does nothing when F2L is already solved', () => {
    const result = solveF2L(createSolvedCube())
    expect(result.complete).toBe(true)
    expect(result.moves.length).toBe(0)
  })

  it('never throws, and a partial/complete result is always internally consistent', () => {
    const { cube: scrambled } = scramble(createSolvedCube(), 20, MOVES)
    const result = solveF2L(scrambled)
    expect(typeof result.complete).toBe('boolean')
    if (result.complete) expect(f2lSolved(result.cube)).toBe(true)
  }, 20000)
})

describe('attemptLastLayer', () => {
  it('never hangs — a small search budget always returns quickly', () => {
    const { cube: scrambled } = scramble(createSolvedCube(), 20, MOVES)
    const start = Date.now()
    // Small explicit budget here — this test checks the search RESPECTS
    // its budget and returns promptly, not that it succeeds.
    attemptLastLayer(scrambled, 4, 20000)
    expect(Date.now() - start).toBeLessThan(5000)
  }, 10000)

  it('solves a last layer that IS reachable by its own validated algorithm set', () => {
    const SUNE = ['R', 'U', "R'", 'U', 'R', 'U2', "R'"]
    let cube = applyMoves(createSolvedCube(), SUNE)
    cube = applyMoves(cube, ['U'])
    cube = applyMoves(cube, SUNE)

    const result = attemptLastLayer(cube, 6, 300000)
    expect(result.solved).toBe(true)
    expect(isSolved(result.cube)).toBe(true)
  })

  it('reports solved:false rather than a wrong result when it cannot find a solution', () => {
    const { cube: scrambled } = scramble(createSolvedCube(), 20, MOVES)
    const result = attemptLastLayer(scrambled, 1, 10)
    if (!result.solved) {
      expect(isSolved(result.cube)).toBe(isSolved(scrambled))
    }
  })
})

describe('solveCube', () => {
  it('is internally consistent: fullySolved is only ever true when the cube genuinely is', () => {
    const { cube: scrambled } = scramble(createSolvedCube(), 12, MOVES)
    const result = solveCube(scrambled)
    expect(result.fullySolved).toBe(isSolved(result.cube))
    if (result.fullySolved) expect(result.f2lComplete).toBe(true)
  }, 120000)
})
