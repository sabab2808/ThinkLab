import { describe, it, expect } from 'vitest'
import { cutoffScoreFor, timeLimitFor, hardnessFor, gridSizeFor } from './levels.js'

describe('level progression', () => {
  it('cutoff score strictly increases and never plateaus (unlimited levels)', () => {
    let prev = cutoffScoreFor(1)
    for (let level = 2; level <= 200; level++) {
      const cutoff = cutoffScoreFor(level)
      expect(cutoff).toBeGreaterThan(prev)
      prev = cutoff
    }
  })

  it('time limit decreases but never drops below a sane floor', () => {
    expect(timeLimitFor(1)).toBe(600)
    for (let level = 1; level <= 100; level++) {
      const t = timeLimitFor(level)
      expect(t).toBeGreaterThanOrEqual(40)
      expect(t).toBeLessThanOrEqual(600)
    }
    expect(timeLimitFor(50)).toBeLessThan(timeLimitFor(1))
  })

  it('hardness increases but stays within a valid 0-1 range', () => {
    for (let level = 1; level <= 500; level++) {
      const h = hardnessFor(level)
      expect(h).toBeGreaterThanOrEqual(0)
      expect(h).toBeLessThanOrEqual(1)
    }
    expect(hardnessFor(30)).toBeGreaterThan(hardnessFor(1))
  })

  it('grid size stays 10x10 regardless of level (difficulty, not size, scales)', () => {
    expect(gridSizeFor(1)).toBe(10)
    expect(gridSizeFor(500)).toBe(10)
  })
})
