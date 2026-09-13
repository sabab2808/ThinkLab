// Mulberry32 — small, fast, deterministic PRNG. Math.random() can't be
// used for maze generation because the server has to regenerate the exact
// same maze from a stored seed to verify a session; a seeded PRNG is what
// makes that possible.
export function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
