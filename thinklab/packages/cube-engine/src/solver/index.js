import { isSolved } from '../cube.js'
import { solveF2L } from './f2l.js'
import { attemptLastLayer } from './lastLayer.js'
import { f2lSolved } from './pieces.js'

/**
 * Solves as much of the cube as this engine can guarantee, and reports
 * honestly about the rest. See f2l.js and lastLayer.js for what's fully
 * validated versus best-effort.
 *
 * Returns { moves, cube, f2lComplete, fullySolved }.
 */
export function solveCube(cube) {
  const f2lResult = solveF2L(cube)
  const moves = [...f2lResult.moves]
  let finalCube = f2lResult.cube

  let fullySolved = false
  if (f2lResult.complete) {
    const lastLayer = attemptLastLayer(finalCube)
    moves.push(...lastLayer.moves)
    finalCube = lastLayer.cube
    fullySolved = lastLayer.solved && isSolved(finalCube)
  }

  return {
    moves,
    cube: finalCube,
    f2lComplete: f2lSolved(finalCube),
    fullySolved,
  }
}
