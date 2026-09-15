import { describe, it, expect } from 'vitest'
import { getLineCells, extractWord } from './selection.js'

describe('getLineCells', () => {
  it('finds a horizontal line', () => {
    const cells = getLineCells({ row: 2, col: 1 }, { row: 2, col: 4 })
    expect(cells).toEqual([
      { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
    ])
  })

  it('finds a horizontal line going right-to-left', () => {
    const cells = getLineCells({ row: 0, col: 4 }, { row: 0, col: 1 })
    expect(cells).toEqual([
      { row: 0, col: 4 }, { row: 0, col: 3 }, { row: 0, col: 2 }, { row: 0, col: 1 },
    ])
  })

  it('finds a vertical line', () => {
    const cells = getLineCells({ row: 0, col: 3 }, { row: 3, col: 3 })
    expect(cells).toEqual([
      { row: 0, col: 3 }, { row: 1, col: 3 }, { row: 2, col: 3 }, { row: 3, col: 3 },
    ])
  })

  it('finds a diagonal line (down-right)', () => {
    const cells = getLineCells({ row: 0, col: 0 }, { row: 3, col: 3 })
    expect(cells).toEqual([
      { row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 3 },
    ])
  })

  it('finds a diagonal line (up-right)', () => {
    const cells = getLineCells({ row: 3, col: 0 }, { row: 0, col: 3 })
    expect(cells).toEqual([
      { row: 3, col: 0 }, { row: 2, col: 1 }, { row: 1, col: 2 }, { row: 0, col: 3 },
    ])
  })

  it('rejects a knight-move (not a straight line)', () => {
    expect(getLineCells({ row: 0, col: 0 }, { row: 2, col: 1 })).toBeNull()
  })

  it('rejects a non-45-degree diagonal', () => {
    expect(getLineCells({ row: 0, col: 0 }, { row: 3, col: 2 })).toBeNull()
  })

  it('rejects selecting the same cell twice', () => {
    expect(getLineCells({ row: 1, col: 1 }, { row: 1, col: 1 })).toBeNull()
  })

  it('single-cell line returned when adjacent', () => {
    const cells = getLineCells({ row: 1, col: 1 }, { row: 1, col: 2 })
    expect(cells.length).toBe(2)
  })
})

describe('extractWord', () => {
  it('reads letters along the given cells in order', () => {
    const grid = { letters: [['c', 'a', 't', 'x'], ['x', 'x', 'x', 'x']] }
    const cells = [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }]
    expect(extractWord(grid, cells)).toBe('cat')
  })
})
