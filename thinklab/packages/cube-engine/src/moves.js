// Face -> (rotation axis, which layer of cubies it selects). Layer is the
// coordinate value along that axis: e.g. R selects every cubie with x===1.
//
// IMPORTANT: "clockwise" (the unprimed move, e.g. "R") is defined here as
// one positive rotation (per geometry.js) about that face's own axis. This
// is a self-consistent internal convention, not independently verified
// against the real-world WCA clockwise-from-outside convention for every
// face — I have no physical cube to check handedness against. The app's
// on-screen diagrams are the authoritative instruction; the letter names
// (U, R, F...) are a familiar label on top of them, not a guarantee that
// "R" here turns the same physical direction a cuber would expect from
// standard notation. See docs/cube-engine.md.
export const FACE_AXIS = {
  U: { axis: 'y', layer: 1 },
  D: { axis: 'y', layer: -1 },
  R: { axis: 'x', layer: 1 },
  L: { axis: 'x', layer: -1 },
  F: { axis: 'z', layer: 1 },
  B: { axis: 'z', layer: -1 },
}

export const FACES = Object.keys(FACE_AXIS)

// All 18 quarter/half-turn moves.
export const MOVES = FACES.flatMap((face) => [face, `${face}'`, `${face}2`])

export function parseMove(move) {
  const face = move[0]
  const suffix = move.slice(1)
  const turns = suffix === "'" ? 3 : suffix === '2' ? 2 : 1
  return { ...FACE_AXIS[face], turns }
}

export function inverseMove(move) {
  const face = move[0]
  const suffix = move.slice(1)
  if (suffix === '2') return move
  if (suffix === "'") return face
  return `${face}'`
}
