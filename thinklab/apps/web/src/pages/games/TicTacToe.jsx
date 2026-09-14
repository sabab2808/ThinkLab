import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createEmptyBoard,
  applyMove,
  checkWinner,
  pickAiMove,
  PLAYER_X,
  PLAYER_O,
} from '@thinklab/game-engine'
import Board from '../../components/Board.jsx'
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

const DIFFICULTIES = ['easy', 'medium', 'impossible']

function boardAtStep(events, step) {
  let board = createEmptyBoard()
  const safeStep = Math.min(Math.max(step, 0), events.length)
  for (let i = 0; i < safeStep; i++) {
    const event = events[i]
    if (!event || board[event.index] !== null) return board
    board = applyMove(board, event.index, event.player)
  }
  return board
}

export default function TicTacToe() {
  const { isAuthenticated, token } = useAuth()

  const [mode, setMode] = useState(null) // null | 'pvp' | 'ai'
  const [difficulty, setDifficulty] = useState('impossible')

  const [board, setBoard] = useState(createEmptyBoard())
  const [turn, setTurn] = useState(PLAYER_X)
  const [events, setEvents] = useState([])
  const [finished, setFinished] = useState(false)
  const [localProofId] = useState(generateProofId)

  const [sessionId, setSessionId] = useState(null)
  const [sessionError, setSessionError] = useState(null)
  const [serverOutcome, setServerOutcome] = useState(null) // { verifiedStatus, proofId, outcome, ratingDelta, achievements }
  const pendingEventWrites = useRef(Promise.resolve())

  const winner = checkWinner(board)
  const isRealSession = Boolean(sessionId) && !sessionError
  const isAiMode = mode === 'ai'

  const { status: localStatus, step: verifyStep } = useVerificationSequence(events, { active: finished })

  // Create the real session once a mode is chosen and the player is signed in.
  useEffect(() => {
    if (!mode || !isAuthenticated || sessionId || finished || sessionError) return
    let cancelled = false
    const opponentOptions = isAiMode ? { opponentType: 'ai', aiDifficulty: difficulty } : {}
    createSessionRequest('tic-tac-toe', token, opponentOptions)
      .then(({ session }) => {
        if (!cancelled) setSessionId(session._id)
      })
      .catch((err) => {
        if (!cancelled) setSessionError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [mode, isAuthenticated, sessionId, finished, sessionError, token, isAiMode, difficulty])

  // AI's turn: pick a move (delayed slightly so it doesn't feel instant/jarring).
  useEffect(() => {
    if (!isAiMode || finished || turn !== PLAYER_O) return
    const timer = setTimeout(() => {
      const index = pickAiMove(board, PLAYER_O, difficulty)
      playMove(index, PLAYER_O)
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiMode, finished, turn, board])

  useEffect(() => {
    if (!finished || !isRealSession) return
    let cancelled = false
    async function finishAfterEventsAreSaved() {
      try {
        await pendingEventWrites.current
        if (cancelled) return
        const { result, proof, outcome, ratingDelta, achievements } = await finishSessionRequest(sessionId, token)
        if (!cancelled) {
          setServerOutcome({
            verifiedStatus: result.verifiedStatus,
            proofId: proof?.proofId,
            outcome,
            ratingDelta,
            achievements,
          })
        }
      } catch (err) {
        if (!cancelled) setSessionError(err.message)
      }
    }

    finishAfterEventsAreSaved()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  function playMove(index, player) {
    const nextBoard = applyMove(board, index, player)
    const sequenceNo = events.length
    const event = { sequenceNo, index, player, t: Date.now() }
    setEvents((prev) => [...prev, event])
    setBoard(nextBoard)

    if (isRealSession) {
      pendingEventWrites.current = pendingEventWrites.current.then(() =>
        submitEventRequest(sessionId, { sequenceNo, eventType: 'move', eventData: { index, player } }, token),
      )
    }

    const result = checkWinner(nextBoard)
    if (result) setFinished(true)
    setTurn(player === PLAYER_X ? PLAYER_O : PLAYER_X)
  }

  function handleCellClick(index) {
    if (winner || board[index]) return
    if (isAiMode && turn !== PLAYER_X) return // AI's turn — no clicking for it
    playMove(index, turn)
  }

  function reset() {
    setBoard(createEmptyBoard())
    setTurn(PLAYER_X)
    setEvents([])
    setFinished(false)
    setSessionId(null)
    setSessionError(null)
    setServerOutcome(null)
    pendingEventWrites.current = Promise.resolve()
  }

  function changeMode() {
    reset()
    setMode(null)
  }

  let status
  if (winner === 'draw') status = 'Draw.'
  else if (winner) status = isAiMode ? (winner === PLAYER_X ? 'You win.' : 'AI wins.') : `${winner} wins.`
  else status = isAiMode ? (turn === PLAYER_X ? 'Your move.' : 'AI thinking…') : `${turn} to move.`

  const displayStatus = isRealSession ? (serverOutcome ? serverOutcome.verifiedStatus : 'verifying') : localStatus
  const displayProofId = isRealSession ? serverOutcome?.proofId : localProofId

  // --- Mode selection screen ---
  if (!mode) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="font-mono text-xs text-text-muted">strategy</p>
        <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Tic-Tac-Toe</h1>
        <p className="mt-2 text-sm text-text-muted sm:text-base">Nine squares. No excuses. Choose who gets the first move.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode('pvp')}
            className="border border-hairline p-5 text-left hover:border-verified"
          >
            <p className="font-display text-lg font-medium">Local PvP</p>
            <p className="mt-1 text-sm text-text-muted">Two minds. One board. Settle it face to face.</p>
          </button>

          <div className="border border-hairline p-5">
            <p className="font-display text-lg font-medium">vs AI</p>
            <p className="mt-1 text-sm text-text-muted">
              {isAuthenticated ? 'A rated match against an opponent that never blinks.' : 'Join the lab for a match that counts.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={
                    'border px-2 py-1 font-mono text-xs capitalize ' +
                    (difficulty === d ? 'border-verified text-verified' : 'border-hairline text-text-muted')
                  }
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMode('ai')}
              className="mt-4 w-full border border-hairline py-2 text-sm hover:border-verified"
            >
              Play vs AI ({difficulty})
            </button>
          </div>
        </div>

        <Link
          to="/games/tic-tac-toe/scan"
          className="mt-4 block border border-hairline p-4 text-sm text-text-muted hover:border-verified hover:text-text"
        >
          Or photograph a physical board to get the best move →
        </Link>
      </main>
    )
  }

  let sessionLabel
  if (isAiMode && isAuthenticated && isRealSession) sessionLabel = `server session · vs AI (${difficulty})`
  else if (isAiMode) sessionLabel = `local · vs AI (${difficulty}) · unrated`
  else if (isAuthenticated && isRealSession) sessionLabel = 'server session · local pvp'
  else sessionLabel = 'local session · pvp'

  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-text-muted">{sessionLabel}</p>
        <button type="button" onClick={changeMode} className="font-mono text-xs text-text-muted hover:text-text">
          change mode
        </button>
      </div>
      <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Tic-Tac-Toe</h1>

      {isAiMode && !isAuthenticated && (
        <p className="mt-2 text-sm text-text-muted">
          <Link to="/login" className="text-verified hover:underline">Sign in</Link> to play AI matches for a real Elo rating.
        </p>
      )}

      {!finished && (
        <>
          <p className="mt-6 font-mono text-sm text-text-muted sm:mt-8">{status}</p>
          <div className="mt-4">
            <Board cells={board} onCellClick={handleCellClick} />
          </div>
        </>
      )}

      {finished && (
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-sm text-text-muted">{status}</p>
            <VerificationStamp
              status={displayStatus}
              proofId={displayStatus === 'verified' ? displayProofId : undefined}
            />
          </div>

          {isRealSession && serverOutcome?.ratingDelta != null && (
            <p className="mt-2 font-mono text-xs text-verified">
              rating {serverOutcome.ratingDelta >= 0 ? '+' : ''}
              {serverOutcome.ratingDelta}
            </p>
          )}

          <div className="mt-6">
            <Board cells={boardAtStep(events, verifyStep)} />
          </div>

          {serverOutcome?.achievements?.length > 0 && (
            <div className="mt-6 border-t border-hairline pt-4">
              <p className="font-mono text-xs text-text-muted">new achievements</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {serverOutcome.achievements.map((type) => (
                  <AchievementBadge key={type} type={type} />
                ))}
              </div>
            </div>
          )}

          {displayStatus === 'verified' && (
            <div className="mt-8 border-t border-hairline pt-6">
              <p className="font-mono text-xs text-text-muted">replay</p>
              <div className="mt-3 max-w-72">
                <ReplayScrubber
                  events={events}
                  renderStep={(step) => <Board cells={boardAtStep(events, step)} size="sm" />}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={reset}
        className="mt-8 border border-hairline px-4 py-2 text-sm hover:border-verified"
      >
        New game
      </button>
    </main>
  )
}
