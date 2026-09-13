import { openNeighbors } from './generator.js'
import { cellKey, reconstructPath } from './pathHelpers.js'

/**
 * BFS explores level by level, so the first time it reaches `end` that
 * path is guaranteed shortest. Returns { path, visitedOrder, nodesExplored }.
 * `path` is [] if `end` is unreachable (shouldn't happen on a generated
 * maze, since generateMaze guarantees full connectivity).
 */
export function bfs(maze, start, end) {
  const queue = [start]
  const visited = new Set([cellKey(start.x, start.y)])
  const cameFrom = new Map()
  const visitedOrder = []

  while (queue.length > 0) {
    const current = queue.shift()
    visitedOrder.push(current)

    if (current.x === end.x && current.y === end.y) {
      return { path: reconstructPath(cameFrom, end), visitedOrder, nodesExplored: visitedOrder.length }
    }

    for (const neighbor of openNeighbors(maze, current.x, current.y)) {
      const key = cellKey(neighbor.x, neighbor.y)
      if (visited.has(key)) continue
      visited.add(key)
      cameFrom.set(key, current)
      queue.push({ x: neighbor.x, y: neighbor.y })
    }
  }

  return { path: [], visitedOrder, nodesExplored: visitedOrder.length }
}
