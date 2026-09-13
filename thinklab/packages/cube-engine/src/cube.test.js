import { describe, it, expect } from 'vitest'
import { createSolvedCube, applyMove, applyMoves, isSolved, scramble } from './cube.js'
import { getFacelets } from './facelets.js'
import { MOVES, inverseMove } from './moves.js'

describe('createSolvedCube', () => {
  it('has 26 cubies', () => {
    expect(createSolvedCube().cubies.length).toBe(26)
  })

  it('is solved', () => {
    expect(isSolved(createSolvedCube())).toBe(true)
  })

  it('every face has all 9 stickers the same color', () => {
    const facelets = getFacelets(createSolvedCube())
    for (const face of Object.keys(facelets)) {
      expect(facelets[face].every((c) => c === face)).toBe(true)
    }
  })
})

describe('applyMove', () => {
  it('every move applied 4 times returns to solved', () => {
    for (const move of MOVES) {
      const base = move[0] // strip ' and 2 to get the base 4-cycle
      let cube = createSolvedCube()
      for (let i = 0; i < 4; i++) cube = applyMove(cube, base)
      expect(isSolved(cube)).toBe(true)
    }
  })

  it('every move followed by its inverse returns to solved', () => {
    for (const move of MOVES) {
      let cube = applyMove(createSolvedCube(), move)
      cube = applyMove(cube, inverseMove(move))
      expect(isSolved(cube)).toBe(true)
    }
  })

  it('a move on a solved cube visibly changes exactly the 12 stickers on adjacent faces', () => {
    // The turned face's own 8 non-center stickers are all the same color
    // on a solved cube, so permuting them among themselves shows no
    // visible change — only the 4 three-sticker strips it carries from
    // adjacent faces (4 x 3 = 12) actually change color.
    for (const move of MOVES) {
      const before = getFacelets(createSolvedCube())
      const after = getFacelets(applyMove(createSolvedCube(), move))
      let changed = 0
      for (const face of Object.keys(before)) {
        for (let i = 0; i < 9; i++) {
          if (before[face][i] !== after[face][i]) changed++
        }
      }
      expect(changed).toBe(12)
    }
  })

  it("known 6-move sequence (R U R' U') repeated 6 times returns to solved", () => {
    // A well-known order-6 commutator, independent of handedness
    // convention — true for ANY consistent quarter-turn definition.
    const seq = ["R", "U", "R'", "U'"]
    let cube = createSolvedCube()
    for (let i = 0; i < 6; i++) cube = applyMoves(cube, seq)
    expect(isSolved(cube)).toBe(true)
  })

  it('a scramble is undone exactly by its reversed, inverted move sequence', () => {
    const { cube: scrambled, moves } = scramble(createSolvedCube(), 25, MOVES)
    const undo = [...moves].reverse().map(inverseMove)
    const restored = applyMoves(scrambled, undo)
    expect(isSolved(restored)).toBe(true)
  })

  it('scrambling actually changes the cube (sanity check the scramble isn\'t a no-op)', () => {
    const { cube: scrambled } = scramble(createSolvedCube(), 20, MOVES)
    expect(isSolved(scrambled)).toBe(false)
  })
})
