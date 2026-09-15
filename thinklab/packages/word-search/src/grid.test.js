import { describe, it, expect } from 'vitest'
import { generateGrid } from './grid.js'

describe('generateGrid', () => {
  it('is deterministic for a given level and seed', () => {
    const a = generateGrid(1, 42)
    const b = generateGrid(1, 42)
    expect(a.letters).toEqual(b.letters)
  })

  it('produces a different grid for a different seed', () => {
    const a = generateGrid(1, 1)
    const b = generateGrid(1, 2)
    expect(a.letters).not.toEqual(b.letters)
  })

  it('produces a different grid for a different level (harder letter mix)', () => {
    const a = generateGrid(1, 42)
    const b = generateGrid(20, 42)
    expect(a.letters).not.toEqual(b.letters)
  })

  it('is always 10x10', () => {
    const grid = generateGrid(5, 7)
    expect(grid.letters.length).toBe(10)
    expect(grid.letters.every((row) => row.length === 10)).toBe(true)
  })

  it('only contains lowercase letters', () => {
    const grid = generateGrid(3, 99)
    for (const row of grid.letters) {
      for (const letter of row) {
        expect(letter).toMatch(/^[a-z]$/)
      }
    }
  })
})
