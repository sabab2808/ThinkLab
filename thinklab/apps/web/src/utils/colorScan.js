export const CAPTURE_ORDER = ['F', 'R', 'B', 'L', 'U', 'D']

function distSq(a, b) {
  return (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2
}

/**
 * Turns 6 faces of raw sampled RGB swatches into the abstract U/D/F/B/L/R
 * labels @thinklab/cube-engine expects. Each face's own center sticker
 * (index 4, which never moves) is used as that face's reference color —
 * every other swatch, across ALL 6 photos, is labeled by whichever of
 * the 6 centers it's closest to. This is why a scrambled sticker that's
 * physically sitting on, say, the Front face but is actually the same
 * pigment as the Up face gets correctly labeled 'U', not 'F'.
 */
export function classifyFacelets(rawByFace) {
  const centers = {}
  for (const face of CAPTURE_ORDER) centers[face] = rawByFace[face][4]

  const facelets = {}
  for (const face of CAPTURE_ORDER) {
    facelets[face] = rawByFace[face].map((swatch) => {
      let best = null
      let bestDist = Infinity
      for (const [label, center] of Object.entries(centers)) {
        const d = distSq(swatch, center)
        if (d < bestDist) {
          bestDist = d
          best = label
        }
      }
      return best
    })
  }
  return facelets
}

export const COLOR_SWATCH_HEX = {
  // Purely for the review UI — shows a small dot in roughly the right
  // hue so a tap-to-correct grid is legible. Not used by the engine.
  U: '#e5e5e5',
  D: '#f2c94c',
  F: '#27ae60',
  B: '#2f80ed',
  L: '#f2994a',
  R: '#eb5757',
}
