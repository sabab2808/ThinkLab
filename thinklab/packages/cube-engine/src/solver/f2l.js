import { applyMoves } from '../cube.js'
import { MOVES } from '../moves.js'
import { iddfs } from './search.js'
import { pieceSolved, f2lSolved, CROSS_EDGES, FIRST_LAYER_CORNERS, MIDDLE_EDGES } from './pieces.js'

// For a piece whose home touches exactly these 2 side faces, U plus
// those 2 faces is often enough to insert it (9 moves instead of 18,
// much faster search) — but only when the piece is reachable without
// touching a third face (e.g. already sitting in the U layer, or in its
// own slot just misoriented). When it's buried in an unrelated slot,
// this fails fast and the caller falls back to the full 18-move search.
function restrictedMoveSet(colors) {
  const sideFaces = colors.filter((c) => c !== 'D' && c !== 'U')
  return ['U', "U'", 'U2', ...sideFaces.flatMap((f) => [f, `${f}'`, `${f}2`])]
}

function solvePiece(cube, goal, sideColors, totalBudgetMs) {
  const deadline = Date.now() + totalBudgetMs

  // Fast pass: restricted move set, shallow depth, short slice of the budget.
  const restricted = restrictedMoveSet(sideColors)
  const restrictedDeadline = Math.min(deadline, Date.now() + Math.min(800, totalBudgetMs / 4))
  for (const depth of [4, 5, 6]) {
    if (Date.now() > restrictedDeadline) break
    const r = iddfs(cube, goal, restricted, depth, restrictedDeadline)
    if (r) return r
  }

  // Fallback: full 18-move search with whatever budget remains.
  for (const depth of [5, 6, 7]) {
    if (Date.now() > deadline) return null
    const r = iddfs(cube, goal, MOVES, depth, deadline)
    if (r) return r
  }
  return null
}

const PIECE_BUDGET_MS = 6000
const MIDDLE_EDGE_BUDGET_MS = 14000

/**
 * Solves the cross, then the 4 first-layer corners, then attempts the 4
 * middle-layer edges — one piece at a time, each search requiring every
 * previously-placed piece to stay solved.
 *
 * Each piece is tried first with a restricted move set (U + its own 2
 * side faces), which is fast when it works; a full 18-move search is the
 * fallback for pieces buried somewhere that restricted set can't reach.
 *
 * MEASURED reliability: cross + corners (the first layer) succeed
 * consistently. Middle-edge insertion, which must additionally preserve
 * the entire first layer, is still the hardest phase — this returns
 * honestly with `complete: false` and a `stage` field showing exactly
 * how far it got when it can't finish, rather than hanging or lying.
 * See docs/cube-engine.md.
 */
export function solveF2L(cube) {
  const moves = []
  let current = cube

  for (let i = 0; i < CROSS_EDGES.length; i++) {
    const alreadyPlaced = CROSS_EDGES.slice(0, i)
    const target = CROSS_EDGES[i]
    const goal = (c) => alreadyPlaced.every((p) => pieceSolved(c, p)) && pieceSolved(c, target)
    const result = solvePiece(current, goal, target, PIECE_BUDGET_MS)
    if (!result) return { moves, cube: current, complete: false, stage: 'cross' }
    current = applyMoves(current, result)
    moves.push(...result)
  }

  for (let i = 0; i < FIRST_LAYER_CORNERS.length; i++) {
    const alreadyPlaced = FIRST_LAYER_CORNERS.slice(0, i)
    const target = FIRST_LAYER_CORNERS[i]
    const goal = (c) =>
      CROSS_EDGES.every((e) => pieceSolved(c, e)) &&
      alreadyPlaced.every((p) => pieceSolved(c, p)) &&
      pieceSolved(c, target)
    const result = solvePiece(current, goal, target, PIECE_BUDGET_MS)
    if (!result) return { moves, cube: current, complete: false, stage: 'corners' }
    current = applyMoves(current, result)
    moves.push(...result)
  }

  for (let i = 0; i < MIDDLE_EDGES.length; i++) {
    const alreadyPlaced = MIDDLE_EDGES.slice(0, i)
    const target = MIDDLE_EDGES[i]
    const goal = (c) => f2lSolved(c) && alreadyPlaced.every((p) => pieceSolved(c, p)) && pieceSolved(c, target)
    const result = solvePiece(current, goal, target, MIDDLE_EDGE_BUDGET_MS)
    if (!result) return { moves, cube: current, complete: false, stage: 'middle-edges' }
    current = applyMoves(current, result)
    moves.push(...result)
  }

  return { moves, cube: current, complete: true, stage: 'done' }
}
