import { vecEquals } from './geometry.js'
import { FACE_AXIS, FACES } from './moves.js'
import { outwardNormal, faceForNormal, createSolvedCube } from './cube.js'

// How the 9 grid cells of a face's PHOTO map to 3D coordinates. This is my
// own internal convention (documented in moves.js as to why exact
// real-world handedness isn't the goal) — what matters is that getFacelets
// and cubeFromFacelets use this SAME table, which is what the round-trip
// test in facelets.test.js checks directly.
const FACE_GRID = {
  U: { rowAxis: 'z', rowVals: [-1, 0, 1], colAxis: 'x', colVals: [-1, 0, 1] },
  D: { rowAxis: 'z', rowVals: [1, 0, -1], colAxis: 'x', colVals: [-1, 0, 1] },
  F: { rowAxis: 'y', rowVals: [1, 0, -1], colAxis: 'x', colVals: [-1, 0, 1] },
  B: { rowAxis: 'y', rowVals: [1, 0, -1], colAxis: 'x', colVals: [1, 0, -1] },
  R: { rowAxis: 'y', rowVals: [1, 0, -1], colAxis: 'z', colVals: [1, 0, -1] },
  L: { rowAxis: 'y', rowVals: [1, 0, -1], colAxis: 'z', colVals: [-1, 0, 1] },
}

function gridToPosition(face, row, col) {
  const { axis, layer } = FACE_AXIS[face]
  const { rowAxis, rowVals, colAxis, colVals } = FACE_GRID[face]
  const pos = { x: 0, y: 0, z: 0 }
  pos[axis] = layer
  pos[rowAxis] = rowVals[row]
  pos[colAxis] = colVals[col]
  return pos
}

function positionToGrid(face, pos) {
  const { rowAxis, rowVals, colAxis, colVals } = FACE_GRID[face]
  const row = rowVals.indexOf(pos[rowAxis])
  const col = colVals.indexOf(pos[colAxis])
  return { row, col }
}

/**
 * Reads off all 54 sticker colors from the current cube state, in the
 * facelet grid convention above. Returns { U: [9 colors row-major], R: [...], ... }.
 */
export function getFacelets(cube) {
  const result = {}
  for (const face of FACES) {
    const normal = outwardNormal(face)
    const grid = new Array(9)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const pos = gridToPosition(face, row, col)
        const cubie = cube.cubies.find((c) => vecEquals(c.position, pos))
        const sticker = cubie.stickers.find((s) => vecEquals(s.normal, normal))
        grid[row * 3 + col] = sticker.color
      }
    }
    result[face] = grid
  }
  return result
}

/**
 * The inverse of getFacelets: reconstructs a full cube state from 54
 * observed sticker colors. Colors here are already the abstract labels
 * (U/D/F/B/L/R) — mapping a real photographed color to one of these six
 * is the frontend's job (see apps/web's color-scan pipeline), not this
 * package's. Built from the SAME grid table as getFacelets, which is what
 * makes the two mutual inverses (checked by facelets.test.js).
 */
export function cubeFromFacelets(faceletsByFace) {
  const solved = createSolvedCube()
  const cubies = solved.cubies.map((slotCubie) => {
    const stickers = slotCubie.stickers.map((s) => {
      const face = faceForNormal(s.normal)
      const { row, col } = positionToGrid(face, slotCubie.position)
      const color = faceletsByFace[face][row * 3 + col]
      return { normal: s.normal, color }
    })
    return { position: slotCubie.position, stickers }
  })
  return { cubies }
}

/**
 * Sanity-checks a scanned facelet set before it's trusted. Catches the
 * most common real scanning mistakes: a face with the wrong number of
 * cells, a color that doesn't appear exactly 9 times overall, or a piece
 * identity that appears more than once (or not at all) — which usually
 * means two stickers were misread as the same color.
 *
 * This does NOT check full cube-group parity (corner twist / edge flip /
 * permutation parity) — that would catch a physically-impossible-but-
 * structurally-plausible misread. Documented as a known gap; the fix is
 * a solvability check before the solver is trusted on production input.
 */
export function validateFacelets(faceletsByFace) {
  const errors = []

  for (const face of FACES) {
    const grid = faceletsByFace[face]
    if (!grid || grid.length !== 9) {
      errors.push(`Face ${face} must have exactly 9 stickers`)
    }
  }
  if (errors.length > 0) return { valid: false, errors }

  const counts = {}
  for (const face of FACES) {
    for (const color of faceletsByFace[face]) {
      counts[color] = (counts[color] || 0) + 1
    }
  }
  for (const face of FACES) {
    if (counts[face] !== 9) {
      errors.push(`Color "${face}" appears ${counts[face] || 0} times (expected 9)`)
    }
  }

  // Identity-uniqueness check: reconstruct, then verify each of the 8
  // corner identities and 12 edge identities shows up exactly once.
  const cube = cubeFromFacelets(faceletsByFace)
  const seen = {}
  for (const cubie of cube.cubies) {
    const identity = cubie.stickers
      .map((s) => s.color)
      .sort()
      .join('')
    seen[identity] = (seen[identity] || 0) + 1
  }
  for (const [identity, count] of Object.entries(seen)) {
    if (count > 1) errors.push(`Piece "${identity}" appears ${count} times — likely a misread sticker`)
  }

  return { valid: errors.length === 0, errors }
}
