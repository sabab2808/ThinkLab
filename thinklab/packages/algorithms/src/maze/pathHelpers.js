export function cellKey(x, y) {
  return `${x},${y}`
}

export function reconstructPath(cameFrom, end) {
  const path = [end]
  let key = cellKey(end.x, end.y)
  while (cameFrom.has(key)) {
    const prev = cameFrom.get(key)
    path.unshift(prev)
    key = cellKey(prev.x, prev.y)
  }
  return path
}

export function manhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}
