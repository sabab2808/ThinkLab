import { faceForNormal } from '../cube.js'

export function findCubieByColors(cube, colors) {
  const target = [...colors].sort().join('')
  return cube.cubies.find((c) => c.stickers.map((s) => s.color).sort().join('') === target)
}

/** True if this piece (identified by its color set) is fully home: right slot, right orientation. */
export function pieceSolved(cube, colors) {
  const cubie = findCubieByColors(cube, colors)
  if (!cubie) return false
  return cubie.stickers.every((s) => faceForNormal(s.normal) === s.color)
}

/** True if this piece's U-colored sticker currently faces up (orientation only, position ignored). */
export function facingUp(cube, colors) {
  const cubie = findCubieByColors(cube, colors)
  const uSticker = cubie.stickers.find((s) => s.color === 'U')
  return uSticker ? uSticker.normal.y === 1 : false
}

export const CROSS_EDGES = [['D', 'F'], ['D', 'R'], ['D', 'B'], ['D', 'L']]
export const FIRST_LAYER_CORNERS = [['D', 'F', 'R'], ['D', 'R', 'B'], ['D', 'B', 'L'], ['D', 'L', 'F']]
export const MIDDLE_EDGES = [['F', 'R'], ['R', 'B'], ['B', 'L'], ['L', 'F']]
export const TOP_EDGES = [['U', 'F'], ['U', 'R'], ['U', 'B'], ['U', 'L']]
export const TOP_CORNERS = [['U', 'F', 'R'], ['U', 'R', 'B'], ['U', 'B', 'L'], ['U', 'L', 'F']]

export function f2lSolved(cube) {
  return CROSS_EDGES.every((e) => pieceSolved(cube, e)) && FIRST_LAYER_CORNERS.every((c) => pieceSolved(cube, c))
}
