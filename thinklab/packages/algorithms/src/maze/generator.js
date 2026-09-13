import { mulberry32 } from '../rng.js'

const DIRS = {
  N: { dx: 0, dy: -1, opposite: 'S' },
  S: { dx: 0, dy: 1, opposite: 'N' },
  E: { dx: 1, dy: 0, opposite: 'W' },
  W: { dx: -1, dy: 0, opposite: 'E' },
}

function cellKey(x, y) {
  return `${x},${y}`
}

/**
 * Generates a maze deterministically from `seed`. Same width, height and
 * seed always produce the exact same maze — the client generates it to
 * render/play, the server regenerates it independently to verify a
 * session, and both must agree without ever transmitting the maze itself.
 *
 * Returns:
 *   { width, height, seed, start: {x,y}, end: {x,y},
 *     grid: grid[y][x] = { N, S, E, W } — true means a wall is present }
 */
export function generateMaze(width, height, seed) {
  const rng = mulberry32(seed)
  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ N: true, S: true, E: true, W: true })),
  )
  const visited = new Set()

  function shuffle(dirs) {
    const arr = [...dirs]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  // Iterative recursive-backtracker (stack-based to avoid recursion depth
  // limits on larger mazes).
  const stack = [{ x: 0, y: 0 }]
  visited.add(cellKey(0, 0))

  while (stack.length > 0) {
    const { x, y } = stack[stack.length - 1]
    const order = shuffle(Object.keys(DIRS))
    let advanced = false

    for (const dir of order) {
      const { dx, dy, opposite } = DIRS[dir]
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
      if (visited.has(cellKey(nx, ny))) continue

      grid[y][x][dir] = false
      grid[ny][nx][opposite] = false
      visited.add(cellKey(nx, ny))
      stack.push({ x: nx, y: ny })
      advanced = true
      break
    }

    if (!advanced) stack.pop()
  }

  return {
    width,
    height,
    seed,
    start: { x: 0, y: 0 },
    end: { x: width - 1, y: height - 1 },
    grid,
  }
}

/** Cells reachable from (x, y) without crossing a wall. */
export function openNeighbors(maze, x, y) {
  const cell = maze.grid[y][x]
  const result = []
  for (const dir of Object.keys(DIRS)) {
    if (cell[dir]) continue // wall present, not passable
    const { dx, dy } = DIRS[dir]
    result.push({ x: x + dx, y: y + dy, dir })
  }
  return result
}

/** Whether moving from (x1,y1) to an adjacent (x2,y2) is legal. */
export function canMove(maze, x1, y1, x2, y2) {
  return openNeighbors(maze, x1, y1).some((n) => n.x === x2 && n.y === y2)
}
