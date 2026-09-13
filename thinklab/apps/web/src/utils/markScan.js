/**
 * Classifies one photographed board cell as 'empty', 'X', or 'O' from
 * raw pixel data. This is a plain heuristic, not a trained classifier —
 * it works reasonably for a clearly drawn/printed board with decent
 * contrast, and it's always shown to the user for confirmation/correction
 * afterward rather than trusted outright.
 *
 * Heuristic:
 *   - A mark is "present" if enough of the cell is dark relative to its
 *     background (fraction of dark pixels above a threshold).
 *   - Given a mark is present, X strokes cross through the very center of
 *     the cell (high center darkness); O is a ring with a light hollow
 *     middle (low center darkness relative to the surrounding ring).
 */
export function classifyCell(imageData, width, height) {
  const { data } = imageData
  const darkThreshold = 128 // luminance below this counts as "ink"

  let darkCount = 0
  let total = 0
  let centerDark = 0
  let centerTotal = 0
  let ringDark = 0
  let ringTotal = 0

  const cx = width / 2
  const cy = height / 2
  const centerRadius = Math.min(width, height) * 0.18
  const ringInner = Math.min(width, height) * 0.28
  const ringOuter = Math.min(width, height) * 0.42

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      const isDark = luminance < darkThreshold
      total++
      if (isDark) darkCount++

      const dist = Math.hypot(x - cx, y - cy)
      if (dist < centerRadius) {
        centerTotal++
        if (isDark) centerDark++
      } else if (dist >= ringInner && dist < ringOuter) {
        ringTotal++
        if (isDark) ringDark++
      }
    }
  }

  const darkness = darkCount / total
  if (darkness < 0.06) return 'empty'

  const centerDarkness = centerTotal > 0 ? centerDark / centerTotal : 0
  const ringDarkness = ringTotal > 0 ? ringDark / ringTotal : 0

  // O: hollow middle, dark ring. X: dark straight through the middle.
  if (ringDarkness > 0.3 && centerDarkness < ringDarkness * 0.6) return 'O'
  return 'X'
}
