import { applyMove } from '../cube.js'

/**
 * Finds the shortest move sequence (restricted to `moveSet`) that makes
 * `goal(cube)` true, via iterative deepening DFS. Returns null if no
 * sequence within `maxDepth` satisfies the goal, OR if `deadlineMs`
 * (wall-clock, via Date.now()) is reached first — the deadline exists
 * because an EXHAUSTIVE failed search at a given depth can take far
 * longer than a successful one, and this must never hang regardless of
 * how deep or hard a particular cube state turns out to be.
 *
 * Every solver phase (see solver/phases/) is just this function with a
 * different goal predicate and move set — the search itself doesn't know
 * anything about cross/corners/edges/etc.
 */
export function iddfs(cube, goal, moveSet, maxDepth, deadlineMs = Date.now() + 4000) {
  if (goal(cube)) return []
  for (let depth = 1; depth <= maxDepth; depth++) {
    if (Date.now() > deadlineMs) return null
    const result = dfs(cube, goal, moveSet, depth, null, deadlineMs)
    if (result === TIMED_OUT) return null
    if (result) return result
  }
  return null
}

const TIMED_OUT = Symbol('timed-out')
const OPPOSITE = { U: 'D', D: 'U', R: 'L', L: 'R', F: 'B', B: 'F' }
const FACE_ORDER = { U: 0, D: 1, R: 2, L: 3, F: 4, B: 5 }
let nodeCounter = 0

function dfs(cube, goal, moveSet, depth, lastFace, deadlineMs) {
  // Checking the clock on every single node would itself be slow at
  // millions of nodes, so only check periodically.
  if ((++nodeCounter & 0xfff) === 0 && Date.now() > deadlineMs) return TIMED_OUT

  for (const move of moveSet) {
    const face = move[0]
    if (face === lastFace) continue // never immediately re-turn the same face
    // Opposite-face moves act on completely disjoint cubies, so they
    // commute — "U then D" and "D then U" reach the identical state.
    // Exploring both orderings is pure wasted search; only allow the
    // canonical one.
    if (lastFace && OPPOSITE[lastFace] === face && FACE_ORDER[face] < FACE_ORDER[lastFace]) continue
    const next = applyMove(cube, move)
    if (goal(next)) return [move]
    if (depth > 1) {
      const rest = dfs(next, goal, moveSet, depth - 1, face, deadlineMs)
      if (rest === TIMED_OUT) return TIMED_OUT
      if (rest) return [move, ...rest]
    }
  }
  return null
}
