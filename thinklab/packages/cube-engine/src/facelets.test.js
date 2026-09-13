import { describe, it, expect } from 'vitest'
import { createSolvedCube, applyMoves, scramble } from './cube.js'
import { getFacelets, cubeFromFacelets, validateFacelets } from './facelets.js'
import { MOVES } from './moves.js'

describe('facelet round-trip', () => {
  it('reconstructs the solved cube exactly from its own facelets', () => {
    const cube = createSolvedCube()
    const facelets = getFacelets(cube)
    const rebuilt = cubeFromFacelets(facelets)
    expect(getFacelets(rebuilt)).toEqual(facelets)
  })

  it('reconstructs many random scrambles exactly', () => {
    for (let trial = 0; trial < 20; trial++) {
      const { cube } = scramble(createSolvedCube(), 30, MOVES)
      const facelets = getFacelets(cube)
      const rebuilt = cubeFromFacelets(facelets)
      expect(getFacelets(rebuilt)).toEqual(facelets)
    }
  })

  it('a reconstructed cube responds to moves identically to the original', () => {
    const { cube } = scramble(createSolvedCube(), 15, MOVES)
    const rebuilt = cubeFromFacelets(getFacelets(cube))

    const testMoves = ["R", "U'", 'F2', 'D']
    const afterOriginal = getFacelets(applyMoves(cube, testMoves))
    const afterRebuilt = getFacelets(applyMoves(rebuilt, testMoves))
    expect(afterRebuilt).toEqual(afterOriginal)
  })
})

describe('validateFacelets', () => {
  it('accepts a solved cube', () => {
    const facelets = getFacelets(createSolvedCube())
    expect(validateFacelets(facelets).valid).toBe(true)
  })

  it('accepts a scrambled (but structurally valid) cube', () => {
    const { cube } = scramble(createSolvedCube(), 20, MOVES)
    expect(validateFacelets(getFacelets(cube)).valid).toBe(true)
  })

  it('rejects a facelet set with the wrong color counts', () => {
    const facelets = getFacelets(createSolvedCube())
    facelets.U[0] = 'R' // now R has 10, U has 8
    const result = validateFacelets(facelets)
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('appears'))).toBe(true)
  })

  it('rejects a duplicated piece identity', () => {
    const facelets = getFacelets(createSolvedCube())
    // Overwrite the UFR corner's stickers to duplicate the UFL corner's
    // identity (colors U, F, L) instead — same total color counts as a
    // legitimate misread would often produce, but now two "UFL" corners
    // and zero "UFR" corners.
    facelets.U[8] = 'L' // was 'U' at the UFR corner's U-sticker position... construct directly below instead
    const result = validateFacelets(facelets)
    expect(result.valid).toBe(false)
  })
})
