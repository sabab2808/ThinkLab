import { applyMoves, isSolved } from '../cube.js'

// These four are the ones I actually validated against this engine (see
// docs/cube-engine.md) — several textbook algorithms I tried (a 2-look
// OLL edge algorithm, T-perm, Y-perm) turned out to disturb the already-
// solved first two layers when run through THIS engine, meaning my
// recollection of them was wrong somewhere. Rather than ship an
// unverified algorithm, this phase only composes ones confirmed correct.
const SUNE = ['R', 'U', "R'", 'U', 'R', 'U2', "R'"]
const ANTISUNE = ["R'", "U'", 'R', "U'", "R'", 'U2', 'R']
const U_PERM_CW = ['R', "U'", 'R', 'U', 'R', 'U', 'R', "U'", "R'", "U'", 'R2']
const U_PERM_CCW = [...U_PERM_CW].reverse().map((m) => (m.endsWith('2') ? m : m.endsWith("'") ? m[0] : `${m}'`))

const ALGORITHMS = [SUNE, ANTISUNE, U_PERM_CW, U_PERM_CCW]

/**
 * Composes up to `maxDepth` applications of the validated algorithm set
 * (with a U-face adjustment tried before each) looking for a sequence
 * that reaches fully solved. Bounded by `maxTries` so it can never hang —
 * it returns null instead of running indefinitely.
 *
 * HONEST LIMITATION: Sune/Anti-Sune only reorient corners; the U-perms
 * only 3-cycle edges. That's a real subgroup of the last-layer group, not
 * all of it — a case needing pure edge-orientation-fixing or a pure
 * corner swap (no edge cycle) will not be found here. In practice this
 * solves a meaningful fraction of scrambles but not every one — when it
 * can't, the caller reports "first two layers solved, last layer needs
 * manual finishing" rather than failing silently or hanging.
 */
export function attemptLastLayer(cube, maxDepth = 6, maxTries = 500000) {
  let tries = 0

  function search(current, movesSoFar, depth) {
    if (isSolved(current)) return movesSoFar
    if (depth === 0) return null

    for (const algo of ALGORITHMS) {
      for (let preAuf = 0; preAuf < 4; preAuf++) {
        tries++
        if (tries > maxTries) return null

        const auf = Array(preAuf).fill('U')
        const next = applyMoves(applyMoves(current, auf), algo)
        const result = search(next, [...movesSoFar, ...auf, ...algo], depth - 1)
        if (result) return result
      }
    }
    return null
  }

  const moves = search(cube, [], maxDepth)
  if (!moves) return { solved: false, moves: [], cube }
  return { solved: true, moves, cube: applyMoves(cube, moves) }
}
