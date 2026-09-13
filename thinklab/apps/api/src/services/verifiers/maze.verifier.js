import { generateMaze, canMove, bfs } from '@thinklab/algorithms'
import { AppError } from '../../utils/AppError.js'
import { elapsedMs } from './elapsedMs.js'

/**
 * Regenerates the maze from the session's Challenge config (width, height,
 * seed) — the same deterministic generator the client used to render it —
 * then replays move events against that maze. Nothing about the maze
 * layout is trusted from the client; only the seed that produced it.
 */
export function verifyMaze(events, session) {
  if (!session.challenge?.config?.width) {
    throw new AppError('Maze session is missing challenge config', 500)
  }

  const { width, height, seed } = session.challenge.config
  const maze = generateMaze(width, height, seed)

  let position = { ...maze.start }
  let illegalMove = false

  for (const event of events) {
    if (event.eventType !== 'move') continue
    const { x, y } = event.eventData
    if (!canMove(maze, position.x, position.y, x, y)) {
      illegalMove = true
      break
    }
    position = { x, y }
  }

  const reachedEnd = position.x === maze.end.x && position.y === maze.end.y

  if (illegalMove || !reachedEnd) {
    return { verified: false, score: 0, moves: events.length, timeMs: elapsedMs(events) }
  }

  const shortest = bfs(maze, maze.start, maze.end)
  const shortestMoves = Math.max(shortest.path.length - 1, 1)
  const actualMoves = events.length
  const efficiency = Math.min(shortestMoves / actualMoves, 1)

  return {
    verified: true,
    score: Math.round(efficiency * 100),
    moves: actualMoves,
    timeMs: elapsedMs(events),
    efficiency,
  }
}
