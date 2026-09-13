/**
 * Reads wall presence from a captured maze photo, given the maze's
 * dimensions. Samples a thin strip along each candidate wall segment
 * (between adjacent cells, and around the outer boundary) and thresholds
 * on average darkness — the same darkness-sampling technique as
 * markScan.js, applied to line segments instead of whole cells.
 *
 * Returns a grid in the exact shape @thinklab/algorithms expects:
 * grid[y][x] = { N, S, E, W } (true = wall present).
 */
export function scanMazeWalls(ctx, size, width, height) {
  const cellW = size / width
  const cellH = size / height
  const strip = Math.max(2, Math.min(cellW, cellH) * 0.12) // sample thickness

  function isDark(x, y, w, h) {
    const { data } = ctx.getImageData(Math.max(0, x), Math.max(0, y), Math.max(1, w), Math.max(1, h))
    let dark = 0
    const n = data.length / 4
    for (let i = 0; i < data.length; i += 4) {
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      if (luminance < 128) dark++
    }
    return dark / n > 0.35
  }

  const grid = []
  for (let y = 0; y < height; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const cx = x * cellW
      const cy = y * cellH

      // Outer boundary is always a wall (standard maze convention);
      // interior boundaries are sampled from the photo.
      const N = y === 0 ? true : isDark(cx + cellW * 0.2, cy - strip / 2, cellW * 0.6, strip)
      const S = y === height - 1 ? true : isDark(cx + cellW * 0.2, cy + cellH - strip / 2, cellW * 0.6, strip)
      const W = x === 0 ? true : isDark(cx - strip / 2, cy + cellH * 0.2, strip, cellH * 0.6)
      const E = x === width - 1 ? true : isDark(cx + cellW - strip / 2, cy + cellH * 0.2, strip, cellH * 0.6)

      row.push({ N, S, E, W })
    }
    grid.push(row)
  }
  return grid
}

/** Mirrors interior walls between adjacent cells so the maze is structurally consistent. */
export function reconcileWalls(grid, width, height) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < width - 1) {
        const wall = grid[y][x].E || grid[y][x + 1].W
        grid[y][x].E = wall
        grid[y][x + 1].W = wall
      }
      if (y < height - 1) {
        const wall = grid[y][x].S || grid[y + 1][x].N
        grid[y][x].S = wall
        grid[y + 1][x].N = wall
      }
    }
  }
  return grid
}
