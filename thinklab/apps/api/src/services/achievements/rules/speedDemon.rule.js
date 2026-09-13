// Thresholds are a starting guess, not tuned against real play data yet.
const THRESHOLD_MS = {
  'tic-tac-toe': 8000,
  maze: 15000,
}

export function speedDemonRule(gameSlug, result) {
  const threshold = THRESHOLD_MS[gameSlug]
  if (!threshold) return null
  if (result.timeMs != null && result.timeMs > 0 && result.timeMs < threshold) {
    return 'speed_demon'
  }
  return null
}
