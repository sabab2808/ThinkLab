// 90-degree rotation of a 3D vector about a coordinate axis. These three
// formulas are the entire geometric foundation of the cube engine — every
// move is just "select cubies on one layer, apply this rotation to their
// position and their stickers' outward-facing directions." Correctness of
// everything downstream (moves, facelets, the solver) reduces to these
// being right, which is checked directly in geometry.test.js and, more
// importantly, by the identity/inverse property tests in cube.test.js.
export function rotateAxis(axis, v) {
  const { x, y, z } = v
  if (axis === 'x') return { x, y: -z, z: y }
  if (axis === 'y') return { x: z, y, z: -x }
  if (axis === 'z') return { x: -y, y: x, z }
  throw new Error(`Unknown axis: ${axis}`)
}

export function rotateAxisTimes(axis, v, times) {
  let result = v
  for (let i = 0; i < ((times % 4) + 4) % 4; i++) {
    result = rotateAxis(axis, result)
  }
  return result
}

export function vecEquals(a, b) {
  return a.x === b.x && a.y === b.y && a.z === b.z
}
