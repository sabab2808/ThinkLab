import { rotateAxisTimes, vecEquals } from './geometry.js'
import { FACE_AXIS, FACES, parseMove } from './moves.js'

// Colors ARE face identities (U, D, F, B, L, R) — not real-world color
// names. Mapping an actual photographed color (white, red, etc.) to one
// of these six labels is the frontend's job (see the color-scan pipeline
// in the web app); this package never touches real RGB values, which
// keeps it environment-agnostic and unit-testable in plain Node.
const OUTWARD = {
  R: { x: 1, y: 0, z: 0 },
  L: { x: -1, y: 0, z: 0 },
  U: { x: 0, y: 1, z: 0 },
  D: { x: 0, y: -1, z: 0 },
  F: { x: 0, y: 0, z: 1 },
  B: { x: 0, y: 0, z: -1 },
}

export function outwardNormal(face) {
  return OUTWARD[face]
}

export function faceForNormal(normal) {
  for (const face of FACES) {
    if (vecEquals(OUTWARD[face], normal)) return face
  }
  return null
}

function allPositions() {
  const positions = []
  for (const x of [-1, 0, 1]) {
    for (const y of [-1, 0, 1]) {
      for (const z of [-1, 0, 1]) {
        if (x === 0 && y === 0 && z === 0) continue // center of the cube, not a cubie
        positions.push({ x, y, z })
      }
    }
  }
  return positions
}

export function createSolvedCube() {
  const cubies = allPositions().map((position) => {
    const stickers = []
    if (position.x !== 0) stickers.push({ normal: { x: position.x, y: 0, z: 0 }, color: position.x === 1 ? 'R' : 'L' })
    if (position.y !== 0) stickers.push({ normal: { x: 0, y: position.y, z: 0 }, color: position.y === 1 ? 'U' : 'D' })
    if (position.z !== 0) stickers.push({ normal: { x: 0, y: 0, z: position.z }, color: position.z === 1 ? 'F' : 'B' })
    return { position, stickers }
  })
  return { cubies }
}

export function applyMove(cube, moveName) {
  const { axis, layer, turns } = parseMove(moveName)
  return {
    cubies: cube.cubies.map((cubie) => {
      if (cubie.position[axis] !== layer) return cubie
      return {
        position: rotateAxisTimes(axis, cubie.position, turns),
        stickers: cubie.stickers.map((s) => ({
          color: s.color,
          normal: rotateAxisTimes(axis, s.normal, turns),
        })),
      }
    }),
  }
}

export function applyMoves(cube, moveNames) {
  return moveNames.reduce(applyMove, cube)
}

export function isSolved(cube) {
  return cube.cubies.every((cubie) =>
    cubie.stickers.every((s) => faceForNormal(s.normal) === s.color),
  )
}

export function scramble(cube, moveCount, moveList, rng = Math.random) {
  const moves = []
  let current = cube
  let lastFace = null
  for (let i = 0; i < moveCount; i++) {
    let candidates = moveList
    if (lastFace) candidates = candidates.filter((m) => m[0] !== lastFace) // avoid immediately undoing/redoing the same face
    const move = candidates[Math.floor(rng() * candidates.length)]
    current = applyMove(current, move)
    moves.push(move)
    lastFace = move[0]
  }
  return { cube: current, moves }
}
