import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { generateMaze, bfs, canMove } from '@thinklab/algorithms'
import MazeGrid from '../../components/MazeGrid.jsx'
import AlgorithmRace from '../../components/AlgorithmRace.jsx'
import ReplayScrubber from '../../components/ReplayScrubber.jsx'
import VerificationStamp from '../../components/VerificationStamp.jsx'
import AchievementBadge from '../../components/AchievementBadge.jsx'
import { useVerificationSequence } from '../../hooks/useVerification.js'
import { generateProofId } from '../../utils/proofId.js'
import { useAuth } from '../../state/AuthContext.jsx'
import {
  createSessionRequest,
  submitEventRequest,
  finishSessionRequest,
} from '../../services/sessionService.js'

function randomSeed() {
  return Math.floor(Math.random() * 2 ** 31)
}

// Reconstructs the player's position after `step` events — the maze
// equivalent of TicTacToe's boardAtStep, used for the same replay pattern.
function positionAtStep(maze, events, step) {
  if (step === 0) return maze.start
  const e = events[step - 1]
  return { x: e.x, y: e.y }
}

export default function MazeLab() {
  const { isAuthenticated, token } = useAuth()

  // --- Algorithm race: purely local, no server involved ---
  const [raceSeed, setRaceSeed] = useState(randomSeed)
  const raceMaze = useMemo(() => generateMaze(12, 12, raceSeed), [raceSeed])

  // --- Play it yourself: local by default, server-backed when signed in ---
  const [playSeed, setPlaySeed] = useState(randomSeed)
  const [sessionId, setSessionId] = useState(null)
  const [sessionError, setSessionError] = useState(null)
  const [challengeConfig, setChallengeConfig] = useState(null)
  const [events, setEvents] = useState([])
  const [finished, setFinished] = useState(false)
  const [localProofId] = useState(generateProofId)
  const [serverResult, setServerResult] = useState(null)

  const isRealSession = Boolean(sessionId) && !sessionError
  // Once a real session exists, the maze MUST come from the server's
  // challenge config (same seed the server will replay against) — a
  // locally-generated maze would silently diverge from what gets verified.
  const maze = useMemo(() => {
    const cfg = challengeConfig || { width: 10, height: 10, seed: playSeed }
    return generateMaze(cfg.width, cfg.height, cfg.seed)
  }, [challengeConfig, playSeed])

  const position = positionAtStep(maze, events, events.length)
  const shortest = useMemo(() => bfs(maze, maze.start, maze.end), [maze])

  const { status: localStatus, step: verifyStep } = useVerificationSequence(events, { active: finished })

  useEffect(() => {
    if (!isAuthenticated || sessionId || finished || sessionError) return
    let cancelled = false
    createSessionRequest('maze', token)
      .then(({ session, challenge }) => {
        if (cancelled) return
        setSessionId(session._id)
        if (challenge) setChallengeConfig(challenge.config)
      })
      .catch((err) => {
        if (!cancelled) setSessionError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, sessionId, finished, sessionError, token])

  useEffect(() => {
    if (!finished || !isRealSession) return
    let cancelled = false
    finishSessionRequest(sessionId, token)
      .then(({ result, proof, ratingDelta, achievements }) => {
        if (!cancelled) setServerResult({
          verifiedStatus: result.verifiedStatus,
          proofId: proof?.proofId,
          efficiency: result.efficiency,
          ratingDelta,
          achievements,
        })
      })
      .catch((err) => {
        if (!cancelled) setSessionError(err.message)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  function handleCellClick(x, y) {
    if (finished) return
    if (!canMove(maze, position.x, position.y, x, y)) return

    const sequenceNo = events.length
    const event = { sequenceNo, x, y, t: Date.now() }
    setEvents([...events, event])

    if (isRealSession) {
      submitEventRequest(sessionId, { sequenceNo, eventType: 'move', eventData: { x, y } }, token)
        .catch((err) => setSessionError(err.message))
    }

    if (x === maze.end.x && y === maze.end.y) setFinished(true)
  }

  function resetPlay() {
    setPlaySeed(randomSeed())
    setSessionId(null)
    setSessionError(null)
    setChallengeConfig(null)
    setEvents([])
    setFinished(false)
    setServerResult(null)
  }

  const displayStatus = isRealSession ? (serverResult ? serverResult.verifiedStatus : 'verifying') : localStatus
  const displayProofId = isRealSession ? serverResult?.proofId : localProofId
  const actualMoves = events.length
  const shortestMoves = Math.max(shortest.path.length - 1, 1)
  const efficiency = isRealSession
    ? serverResult?.efficiency
    : Math.min(shortestMoves / Math.max(actualMoves, 1), 1)

  let sessionLabel
  if (isAuthenticated && isRealSession) sessionLabel = 'server session · seeded maze'
  else if (isAuthenticated && sessionError) sessionLabel = 'server unreachable · local fallback'
  else sessionLabel = 'local session · unverified'

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="font-mono text-xs text-text-muted">pathfinding</p>
      <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Maze Lab</h1>
      <p className="mt-2 max-w-2xl text-sm text-text-muted sm:text-base">
        Watch four algorithms race through the same maze. Then take the wheel
        and see whether your instincts can beat the shortest route.
      </p>
      <Link to="/games/maze/scan" className="mt-3 inline-block text-sm text-verified hover:underline">
        Or scan a physical maze with your camera →
      </Link>

      <section className="mt-12 border-t border-hairline pt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-medium">Algorithm race</h2>
          <button
            type="button"
            onClick={() => setRaceSeed(randomSeed())}
            className="border border-hairline px-3 py-1.5 font-mono text-xs hover:border-verified"
          >
            NEW MAZE
          </button>
        </div>
        <div className="mt-6">
          <AlgorithmRace key={raceSeed} maze={raceMaze} />
        </div>
      </section>

      <section className="mt-16 border-t border-hairline pt-8">
        <h2 className="font-display text-lg font-medium">Play it yourself</h2>
        <p className="mt-1 font-mono text-xs text-text-muted">{sessionLabel}</p>
        {!isAuthenticated && (
          <p className="mt-2 text-sm text-text-muted">
            <Link to="/login" className="text-verified hover:underline">Sign in</Link> to get a
            server-verified, seeded maze and a real efficiency-based rating.
          </p>
        )}

        {!finished ? (
          <div className="mt-6 max-w-96">
            <MazeGrid maze={maze} playerPos={position} onCellClick={handleCellClick} />
            <p className="mt-3 font-mono text-xs text-text-muted">
              {actualMoves} move{actualMoves === 1 ? '' : 's'} so far — click an adjacent open cell to move
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-sm text-text-muted">
                Solved in {actualMoves} moves (shortest possible: {shortestMoves})
              </p>
              <VerificationStamp
                status={displayStatus}
                proofId={displayStatus === 'verified' ? displayProofId : undefined}
              />
            </div>

            {displayStatus === 'verified' && efficiency != null && (
              <p className="mt-2 font-mono text-xs text-verified">
                efficiency {Math.round(efficiency * 100)}%
              </p>
            )}

            {isRealSession && serverResult?.ratingDelta != null && (
              <p className="mt-1 font-mono text-xs text-verified">
                rating {serverResult.ratingDelta >= 0 ? '+' : ''}
                {serverResult.ratingDelta}
              </p>
            )}

            {serverResult?.achievements?.length > 0 && (
              <div className="mt-6 border-t border-hairline pt-4">
                <p className="font-mono text-xs text-text-muted">new achievements</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {serverResult.achievements.map((type) => (
                    <AchievementBadge key={type} type={type} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 max-w-96">
              <MazeGrid maze={maze} playerPos={positionAtStep(maze, events, verifyStep)} />
            </div>

            {displayStatus === 'verified' && (
              <div className="mt-8 max-w-96 border-t border-hairline pt-6">
                <p className="font-mono text-xs text-text-muted">replay</p>
                <div className="mt-3">
                  <ReplayScrubber
                    events={events}
                    renderStep={(step) => (
                      <MazeGrid maze={maze} playerPos={positionAtStep(maze, events, step)} path={shortest.path} compact />
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={resetPlay}
          className="mt-8 border border-hairline px-4 py-2 text-sm hover:border-verified"
        >
          New maze
        </button>
      </section>
    </main>
  )
}
