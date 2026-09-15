import { describe, it, expect } from 'vitest'
import { isValidWord, matchWord, dictionarySize } from './dictionary.js'
import { scoreForWord, INVALID_PENALTY } from './scoring.js'

describe('isValidWord', () => {
  it('recognizes common real words', () => {
    expect(isValidWord('cat')).toBe(true)
    expect(isValidWord('house')).toBe(true)
    expect(isValidWord('puzzle')).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(isValidWord('CAT')).toBe(true)
    expect(isValidWord('CaT')).toBe(true)
  })

  it('matches words selected in reverse', () => {
    expect(matchWord('tac')).toBe('cat')
    expect(isValidWord('tac')).toBe(true)
  })

  it('rejects nonsense letter strings', () => {
    expect(isValidWord('qzxvb')).toBe(false)
    expect(isValidWord('zzxxqq')).toBe(false)
  })

  it('has a substantial vocabulary loaded', () => {
    expect(dictionarySize()).toBeGreaterThan(100000)
  })
})

describe('scoreForWord', () => {
  it('scores longer words higher than shorter ones', () => {
    expect(scoreForWord('cat')).toBeLessThan(scoreForWord('catalog'))
  })

  it('gives a positive score for any valid length', () => {
    for (let len = 3; len <= 10; len++) {
      expect(scoreForWord('a'.repeat(len))).toBeGreaterThan(0)
    }
  })

  it('has no negative penalty for invalid guesses', () => {
    expect(INVALID_PENALTY).toBe(0)
  })
})
