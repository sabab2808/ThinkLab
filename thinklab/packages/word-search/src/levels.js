/**
 * Unlimited levels: every level is generated from a formula, not a fixed
 * table, so there's no upper bound. Levels get harder along two axes at
 * once — less time, and a letter distribution that drifts away from
 * common English frequency toward uniform (more Qs and Zs, fewer Es and
 * Ts), which makes real words genuinely harder to spot even though the
 * grid is still the same 10x10 size.
 */

const GRID_SIZE = 10
const BASE_TIME_SECONDS = 600
const MIN_TIME_SECONDS = 40
const BASE_CUTOFF = 15
const CUTOFF_GROWTH_PER_LEVEL = 6

export function gridSizeFor() {
  return GRID_SIZE
}

export function timeLimitFor(level) {
  const decay = Math.min(level - 1, 10) * 5 // levels off after level 11
  return Math.max(MIN_TIME_SECONDS, BASE_TIME_SECONDS - decay)
}

export function cutoffScoreFor(level) {
  return BASE_CUTOFF + (level - 1) * CUTOFF_GROWTH_PER_LEVEL
}

/** 0 (easiest, common-letter-weighted) to ~0.85 (near-uniform, brutal). */
export function hardnessFor(level) {
  return Math.min(0.85, (level - 1) * 0.06)
}
