import { describe, it, expect } from 'vitest'
import { bfs } from './bfs.js'
import { dfs } from './dfs.js'
import { dijkstra } from './dijkstra.js'
import { astar } from './astar.js'
import { generateMaze } from './generator.js'

// A hand-built 3-cell straight corridor: (0,0) — (1,0) — (2,0).
// No branches, so every algorithm has exactly one possible path — good
// for asserting exact output, independent of the maze generator.
const corridor = {
  width: 3,
  height: 1,
  start: { x: 0, y: 0 },
  end: { x: 2, y: 0 },
  grid: [
    [
      { N: true, S: true, E: false, W: true },
      { N: true, S: true, E: false, W: false },
      { N: true, S: true, E: true, W: false },
    ],
  ],
}

const expectedCorridorPath = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
]

describe.each([
  ['bfs', bfs],
  ['dfs', dfs],
  ['dijkstra', dijkstra],
  ['astar', astar],
])('%s on a straight corridor', (name, algorithm) => {
  it('finds the only possible path', () => {
    const { path } = algorithm(corridor, corridor.start, corridor.end)
    expect(path).toEqual(expectedCorridorPath)
  })
})

describe('cross-algorithm consistency on a generated maze', () => {
  const maze = generateMaze(12, 12, 123)

  it('bfs, dijkstra, and astar all find equally short paths', () => {
    const b = bfs(maze, maze.start, maze.end)
    const d = dijkstra(maze, maze.start, maze.end)
    const a = astar(maze, maze.start, maze.end)

    expect(d.path.length).toBe(b.path.length)
    expect(a.path.length).toBe(b.path.length)
  })

  it('dfs finds a valid path, though not necessarily the shortest', () => {
    const b = bfs(maze, maze.start, maze.end)
    const f = dfs(maze, maze.start, maze.end)

    expect(f.path[0]).toEqual(maze.start)
    expect(f.path[f.path.length - 1]).toEqual(maze.end)
    expect(f.path.length).toBeGreaterThanOrEqual(b.path.length)
  })

  it('astar explores no more nodes than bfs, thanks to the heuristic', () => {
    const b = bfs(maze, maze.start, maze.end)
    const a = astar(maze, maze.start, maze.end)

    expect(a.nodesExplored).toBeLessThanOrEqual(b.nodesExplored)
  })
})
