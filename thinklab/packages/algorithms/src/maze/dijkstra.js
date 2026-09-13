import { openNeighbors } from './generator.js'
import { cellKey, reconstructPath } from './pathHelpers.js'

/**
 * Every maze edge has weight 1, so Dijkstra finds the same shortest path
 * BFS does — but it gets there by tracking cumulative distance and always
 * expanding the closest unvisited cell, which is the general algorithm
 * BFS is a special case of. Included for that comparison, not because it
 * beats BFS here.
 *
 * Priority queue is a naive linear scan over an unvisited set — mazes in
 * this app are small enough (a few hundred cells) that a binary heap
 * wouldn't be noticeable, and the linear scan is much easier to read.
 */
export function dijkstra(maze, start, end) {
  const dist = new Map([[cellKey(start.x, start.y), 0]])
  const cameFrom = new Map()
  const visitedOrder = []
  const unvisited = new Set([cellKey(start.x, start.y)])
  const coords = new Map([[cellKey(start.x, start.y), start]])

  while (unvisited.size > 0) {
    let currentKey = null
    let currentDist = Infinity
    for (const key of unvisited) {
      const d = dist.get(key)
      if (d < currentDist) {
        currentDist = d
        currentKey = key
      }
    }

    unvisited.delete(currentKey)
    const current = coords.get(currentKey)
    visitedOrder.push(current)

    if (current.x === end.x && current.y === end.y) {
      return { path: reconstructPath(cameFrom, end), visitedOrder, nodesExplored: visitedOrder.length }
    }

    for (const neighbor of openNeighbors(maze, current.x, current.y)) {
      const key = cellKey(neighbor.x, neighbor.y)
      const tentative = currentDist + 1
      if (tentative < (dist.get(key) ?? Infinity)) {
        dist.set(key, tentative)
        cameFrom.set(key, current)
        coords.set(key, { x: neighbor.x, y: neighbor.y })
        unvisited.add(key)
      }
    }
  }

  return { path: [], visitedOrder, nodesExplored: visitedOrder.length }
}
