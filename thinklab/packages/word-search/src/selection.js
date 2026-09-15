/**
 * Given a start and end cell, returns the ordered list of cells between
 * them (inclusive) if they form a straight horizontal, vertical, or
 * diagonal line — any of the 8 standard word-search directions. Returns
 * null if they don't line up (e.g. a knight's-move click), or if start
 * and end are the same cell.
 */
export function getLineCells(start, end) {
  const dr = end.row - start.row
  const dc = end.col - start.col

  if (dr === 0 && dc === 0) return null

  const isHorizontal = dr === 0
  const isVertical = dc === 0
  const isDiagonal = Math.abs(dr) === Math.abs(dc)
  if (!isHorizontal && !isVertical && !isDiagonal) return null

  const length = Math.max(Math.abs(dr), Math.abs(dc)) + 1
  const stepR = Math.sign(dr)
  const stepC = Math.sign(dc)

  const cells = []
  for (let i = 0; i < length; i++) {
    cells.push({ row: start.row + stepR * i, col: start.col + stepC * i })
  }
  return cells
}

export function extractWord(grid, cells) {
  return cells.map((c) => grid.letters[c.row][c.col]).join('')
}

export function cellKey(cell) {
  return `${cell.row},${cell.col}`
}
