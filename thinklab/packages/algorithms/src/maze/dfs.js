import { openNeighbors } from './generator.js'
import { cellKey, reconstructPath } from './pathHelpers.js'

/**
 * DFS dives down one branch as far as it can before backtracking. It will
 * find *a* path, but rarely the shortest one — that's the point of
 * including it alongside BFS in the race: same maze, visibly different
 * exploration shape and a visibly worse (or luckier) result.
 */
export function dfs(maze, start, end) {
  const stack = [start]
  const visited = new Set([cellKey(start.x, start.y)])
  const cameFrom = new Map()
  const visitedOrder = []

  while (stack.length > 0) {
    const current = stack.pop()
    visitedOrder.push(current)

    if (current.x === end.x && current.y === end.y) {
      return { path: reconstructPath(cameFrom, end), visitedOrder, nodesExplored: visitedOrder.length }
    }

    for (const neighbor of openNeighbors(maze, current.x, current.y)) {
      const key = cellKey(neighbor.x, neighbor.y)
      if (visited.has(key)) continue
      visited.add(key)
      cameFrom.set(key, current)
      stack.push({ x: neighbor.x, y: neighbor.y })
    }
  }

  return { path: [], visitedOrder, nodesExplored: visitedOrder.length }
}
