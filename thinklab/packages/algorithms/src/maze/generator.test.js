import { describe, it, expect } from 'vitest'
import { generateMaze, openNeighbors, canMove } from './generator.js'
import { bfs } from './bfs.js'

describe('generateMaze', () => {
  it('is deterministic for a given seed', () => {
    const a = generateMaze(8, 8, 42)
    const b = generateMaze(8, 8, 42)
    expect(a.grid).toEqual(b.grid)
  })

  it('produces a different maze for a different seed', () => {
    const a = generateMaze(8, 8, 1)
    const b = generateMaze(8, 8, 2)
    expect(a.grid).not.toEqual(b.grid)
  })

  it('always produces a maze solvable from start to end', () => {
    for (const seed of [1, 2, 3, 42, 999]) {
      const maze = generateMaze(10, 10, seed)
      const { path } = bfs(maze, maze.start, maze.end)
      expect(path.length).toBeGreaterThan(0)
      expect(path[0]).toEqual(maze.start)
      expect(path[path.length - 1]).toEqual(maze.end)
    }
  })

  it('has correctly mirrored walls between adjacent cells', () => {
    const maze = generateMaze(6, 6, 7)
    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        for (const { x: nx, y: ny } of openNeighbors(maze, x, y)) {
          // If (x,y) can reach (nx,ny), the reverse must also be true.
          expect(canMove(maze, nx, ny, x, y)).toBe(true)
        }
      }
    }
  })
})
