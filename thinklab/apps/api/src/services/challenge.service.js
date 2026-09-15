import { Challenge } from '../models/Challenge.js'

const MAZE_SIZE = { width: 10, height: 10 }

/**
 * Creates a new Challenge for a maze session with a random seed. The seed
 * is the only thing that needs to be stored and later replayed — see
 * services/verifiers/maze.verifier.js, which regenerates the identical
 * maze from this same config to verify the session.
 */
export async function createMazeChallenge(gameId) {
  const seed = Math.floor(Math.random() * 2 ** 31)
  return Challenge.create({
    game: gameId,
    difficulty: 'standard',
    config: { ...MAZE_SIZE, seed },
  })
}

/**
 * Creates a new Challenge for a Word Search round at the given level.
 * Same pattern as the maze: only (level, seed) need to be stored, since
 * @thinklab/word-search's generateGrid regenerates the identical grid
 * from those two values, both client-side and in the verifier.
 */
export async function createWordSearchChallenge(gameId, level) {
  const seed = Math.floor(Math.random() * 2 ** 31)
  return Challenge.create({
    game: gameId,
    difficulty: `level-${level}`,
    config: { level, seed },
  })
}
