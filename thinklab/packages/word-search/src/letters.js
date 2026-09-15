import { mulberry32 } from './rng.js'

// Roughly English letter frequency (as percentages), used so the grid
// feels like real language rather than uniform noise — same idea as
// weighted dice in Boggle or tile counts in Scrabble. Rarer letters
// (q, x, z, j) get pulled toward the higher end of this table as the
// difficulty level increases (see levels.js), which is what actually
// makes later rounds harder: less common letters are harder to chain
// into real words.
const BASE_FREQUENCY = {
  e: 12.7, t: 9.1, a: 8.2, o: 7.5, i: 7.0, n: 6.7, s: 6.3, h: 6.1, r: 6.0,
  d: 4.3, l: 4.0, c: 2.8, u: 2.8, m: 2.4, w: 2.4, f: 2.2, g: 2.0, y: 2.0,
  p: 1.9, b: 1.5, v: 1.0, k: 0.8, j: 0.15, x: 0.15, q: 0.1, z: 0.07,
}

/** Blends the base frequency toward uniform as `hardness` (0-1) rises. */
function weightedAlphabet(hardness) {
  const letters = Object.keys(BASE_FREQUENCY)
  const uniform = 100 / letters.length
  const weights = letters.map((l) => BASE_FREQUENCY[l] * (1 - hardness) + uniform * hardness)
  return { letters, weights }
}

export function pickLetter(rng, hardness = 0) {
  const { letters, weights } = weightedAlphabet(hardness)
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rng() * total
  for (let i = 0; i < letters.length; i++) {
    r -= weights[i]
    if (r <= 0) return letters[i]
  }
  return letters[letters.length - 1]
}

export function createRng(seed) {
  return mulberry32(seed)
}
