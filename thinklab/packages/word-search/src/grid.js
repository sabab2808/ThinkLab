import { createRng, pickLetter } from './letters.js'
import { gridSizeFor, hardnessFor } from './levels.js'

/**
 * Generates the letter grid for a level. Same (level, seed) always
 * produces the same grid — client renders it, server regenerates it
 * independently to verify a session, same pattern as the maze generator.
 */
export function generateGrid(level, seed) {
  const size = gridSizeFor(level)
  const rng = createRng(seed)
  const hardness = hardnessFor(level)

  const letters = []
  for (let row = 0; row < size; row++) {
    const rowLetters = []
    for (let col = 0; col < size; col++) {
      rowLetters.push(pickLetter(rng, hardness))
    }
    letters.push(rowLetters)
  }

  return { size, letters, level, seed }
}
