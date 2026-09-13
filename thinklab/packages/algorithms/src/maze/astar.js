import { openNeighbors } from './generator.js'
import { cellKey, reconstructPath, manhattanDistance } from './pathHelpers.js'

/**
 * Same shortest-path guarantee as Dijkstra, but expands far fewer nodes
 * because the Manhattan-distance heuristic biases the search toward
 * `end` instead of expanding uniformly outward. On a maze with no
 * diagonal moves, Manhattan distance never overestimates the true
 * remaining distance, so the heuristic stays admissible and the result
 * is still guaranteed shortest.
 */
export function astar(maze, start, end) {
  const gScore = new Map([[cellKey(start.x, start.y), 0]])
  const cameFrom = new Map()
  const visitedOrder = []
  const open = new Set([cellKey(start.x, start.y)])
  const coords = new Map([[cellKey(start.x, start.y), start]])

  while (open.size > 0) {
    let currentKey = null
    let bestF = Infinity
    for (const key of open) {
      const f = gScore.get(key) + manhattanDistance(coords.get(key), end)
      if (f < bestF) {
        bestF = f
        currentKey = key
      }
    }

    open.delete(currentKey)
    const current = coords.get(currentKey)
    visitedOrder.push(current)

    if (current.x === end.x && current.y === end.y) {
      return { path: reconstructPath(cameFrom, end), visitedOrder, nodesExplored: visitedOrder.length }
    }

    for (const neighbor of openNeighbors(maze, current.x, current.y)) {
      const key = cellKey(neighbor.x, neighbor.y)
      const tentative = gScore.get(currentKey) + 1
      if (tentative < (gScore.get(key) ?? Infinity)) {
        gScore.set(key, tentative)
        cameFrom.set(key, current)
        coords.set(key, { x: neighbor.x, y: neighbor.y })
        open.add(key)
      }
    }
  }

  return { path: [], visitedOrder, nodesExplored: visitedOrder.length }
}
