import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  generateGrid,
  getLineCells,
  extractWord,
  matchWord,
  scoreForWord,
  INVALID_PENALTY,
  timeLimitFor,
  cutoffScoreFor,
} from '@thinklab/word-search'
import WordSearchGrid from '../../components/WordSearchGrid.jsx'
import AchievementBadge from '../../components/AchievementBadge.jsx'
import { useAuth } from '../../state/AuthContext.jsx'
import {
  createSessionRequest,
  submitEventRequest,
  finishSessionRequest,
} from '../../services/sessionService.js'

const LEVEL_STORAGE_KEY = 'thinklab_word_search_level'

function loadStoredLevel(username) {
  try {
    const raw = localStorage.getItem(`${LEVEL_STORAGE_KEY}:${username}`)
    const n = Number(raw)
    return Number.isInteger(n) && n > 0 ? n : 1
  } catch {
    return 1
  }
}

export default function WordSearch() {
  const { isAuthenticated, token, user } = useAuth()

  const [level, setLevel] = useState(() => (user ? loadStoredLevel(user.username) : 1))
  const [phase, setPhase] = useState('idle') // idle | playing | finished

  const [grid, setGrid] = useState(null)
  const [foundWords, setFoundWords] = useState([]) // [{ word, cells, points }]
  const [localScore, setLocalScore] = useState(0)
  const [flash, setFlash] = useState(null) // { type: 'good'|'bad'|'neutral', text }
  const [timeLeft, setTimeLeft] = useState(0)

  const [sessionId, setSessionId] = useState(null)
  const [sessionError, setSessionError] = useState(null)
  const [serverResult, setServerResult] = useState(null)
  const [finishing, setFinishing] = useState(false)

  // Refs that let async callbacks (the countdown interval, the session
  // creation promise) always see the LATEST value instead of the one
  // captured when they were first created — without these, a stale
  // closure could call finish with a null sessionId even after the
  // session had since been created, or silently drop clicks made in the
  // brief window before session creation resolves.
  const timerRef = useRef(null)
  const finishedRef = useRef(false)
  const eventsRef = useRef([])
  const pendingEventsRef = useRef([]) // events made before sessionId was ready
  const sessionIdRef = useRef(null)
  const sessionErrorRef = useRef(null)

  const isRealSession = Boolean(sessionId) && !sessionError
  const cutoff = cutoffScoreFor(level)
  const totalTime = timeLimitFor(level)

  useEffect(() => {
    sessionIdRef.current = sessionId
    sessionErrorRef.current = sessionError
    if (sessionId && !sessionError && pendingEventsRef.current.length > 0) {
      const queued = pendingEventsRef.current
      pendingEventsRef.current = []
      for (const event of queued) {
        submitEventRequest(sessionId, event, token).catch((err) => setSessionError(err.message))
      }
    }
  }, [sessionId, sessionError, token])

  const finishRound = useCallback(async () => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearInterval(timerRef.current)
    setPhase('finished')

    const currentSessionId = sessionIdRef.current
    const currentSessionError = sessionErrorRef.current

    if (isAuthenticated && currentSessionId && !currentSessionError) {
      setFinishing(true)
      try {
        const data = await finishSessionRequest(currentSessionId, token)
        setServerResult(data)
        if (data.passed && user) {
          const next = level + 1
          setLevel(next)
          localStorage.setItem(`${LEVEL_STORAGE_KEY}:${user.username}`, String(next))
        }
      } catch (err) {
        setSessionError(err.message)
      } finally {
        setFinishing(false)
      }
    }
  }, [isAuthenticated, token, level, user])

  function startRound() {
    eventsRef.current = []
    pendingEventsRef.current = []
    setFoundWords([])
    setLocalScore(0)
    setFlash(null)
    setServerResult(null)
    setSessionError(null)
    setSessionId(null)
    sessionIdRef.current = null
    sessionErrorRef.current = null
    finishedRef.current = false
    setGrid(null)
    setPhase('starting')

    if (isAuthenticated) {
      // The server owns the seed for a real session — same trust
      // pattern as the maze ("the client can't be trusted to pick its
      // own seed"). We MUST use the seed it returns, not one chosen
      // locally, or the grid the player sees would never match what the
      // server independently regenerates to verify the round.
      createSessionRequest('word-search', token, { level })
        .then(({ session, challenge }) => {
          setSessionId(session._id)
          sessionIdRef.current = session._id
          const newGrid = generateGrid(challenge.config.level, challenge.config.seed)
          setGrid(newGrid)
          setTimeLeft(timeLimitFor(level))
          setPhase('playing')
        })
        .catch((err) => {
          setSessionError(err.message)
          // Server unreachable — fall back to an unverified local round
          // rather than leaving the player stuck.
          const seed = Math.floor(Math.random() * 2 ** 31)
          setGrid(generateGrid(level, seed))
          setTimeLeft(timeLimitFor(level))
          setPhase('playing')
        })
    } else {
      const seed = Math.floor(Math.random() * 2 ** 31)
      setGrid(generateGrid(level, seed))
      setTimeLeft(timeLimitFor(level))
      setPhase('playing')
    }
  }

  // Countdown timer. Depends only on `phase` so it isn't recreated every
  // render, but calls finishRound via closure — since finishRound itself
  // reads sessionId through a ref (not directly), it always acts on
  // current data even though this effect only runs once per round.
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          finishRound()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, finishRound])

  function handleSelect(start, end) {
    if (phase !== 'playing' || !grid) return
    const cells = getLineCells(start, end)
    if (!cells) return
    const word = extractWord(grid, cells)
    const matchedWord = matchWord(word)

    const sequenceNo = eventsRef.current.length
    const event = {
      sequenceNo,
      eventType: 'select',
      eventData: { startRow: start.row, startCol: start.col, endRow: end.row, endCol: end.col },
    }
    eventsRef.current = [...eventsRef.current, event]

    if (isAuthenticated) {
      if (sessionIdRef.current && !sessionErrorRef.current) {
        submitEventRequest(sessionIdRef.current, event, token).catch((err) => setSessionError(err.message))
      } else if (!sessionErrorRef.current) {
        // Session hasn't finished being created yet — queue it, flushed
        // by the effect above once sessionId lands.
        pendingEventsRef.current.push(event)
      }
    }

    if (word.length < 3) return

    const alreadyFound = foundWords.some((f) => f.word === matchedWord)
    if (alreadyFound) {
      setFlash({ type: 'neutral', text: `Already found "${word}"` })
      return
    }

    if (matchedWord) {
      const points = scoreForWord(word)
      setFoundWords((prev) => [...prev, { word: matchedWord, cells, points }])
      setLocalScore((s) => s + points)
      setFlash({ type: 'good', text: `+${points} · ${matchedWord}` })
    } else {
      setFlash({ type: 'neutral', text: `"${word}" isn't a word` })
    }
  }

  const allFoundCells = useMemo(() => foundWords.flatMap((f) => f.cells), [foundWords])

  const displayScore = isRealSession && serverResult ? serverResult.result.score : localScore
  const displayPassed = isRealSession && serverResult ? serverResult.passed : localScore >= cutoff

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="font-mono text-xs text-text-muted">vocabulary</p>
      <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Word Search</h1>
      <p className="mt-2 text-sm text-text-muted sm:text-base">
        Select letters in a straight line — any direction — to find real words. Longer words
        score more; wrong guesses do not reduce your score.
      </p>

      {phase === 'idle' && (
        <div className="mt-8 border border-hairline p-6">
          <p className="font-display text-xl">Level {level}</p>
          <p className="mt-2 font-mono text-xs text-text-muted">
            {totalTime}s round · need {cutoff} points to advance
          </p>
          {!isAuthenticated && (
            <p className="mt-3 text-sm text-text-muted">
              <Link to="/login" className="text-verified hover:underline">Sign in</Link> for a
              server-verified round, a real rating, and saved level progress.
            </p>
          )}
          <button
            type="button"
            onClick={startRound}
            className="mt-4 border border-hairline px-4 py-2 text-sm hover:border-verified"
          >
            Start round
          </button>
        </div>
      )}

      {phase === 'starting' && (
        <div className="mt-8 flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-live" />
          <p className="font-mono text-sm text-text-muted">Starting round…</p>
        </div>
      )}

      {phase === 'playing' && grid && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-sm">
            <span className="text-text-muted">Level {level}</span>
            <span className={timeLeft <= 60 ? 'text-danger' : 'text-text-muted'}>{timeLeft}s</span>
            <span className="text-verified">{localScore} / {cutoff} pts</span>
          </div>

          <div className="mt-4 h-1 w-full bg-hairline">
            <div
              className="h-1 bg-live transition-all"
              style={{ width: `${(timeLeft / totalTime) * 100}%` }}
            />
          </div>

          {flash && (
            <p
              className={
                'mt-3 font-mono text-xs ' +
                (flash.type === 'good' ? 'text-verified' : flash.type === 'bad' ? 'text-danger' : 'text-text-muted')
              }
            >
              {flash.text}
            </p>
          )}

          <div className="mt-4">
            <WordSearchGrid grid={grid} foundCells={allFoundCells} onSelect={handleSelect} />
          </div>

          {foundWords.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {foundWords.map((f) => (
                <span key={f.word} className="border border-hairline px-2 py-0.5 font-mono text-[10px] text-verified">
                  {f.word} +{f.points}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {phase === 'finished' && (
        <div className="mt-8">
          {finishing && <p className="font-mono text-sm text-text-muted">Verifying round…</p>}

          {!finishing && (
            <>
              <div className="border border-hairline p-6">
                <p
                  className={
                    'font-mono text-xs ' + (displayPassed ? 'text-verified' : 'text-live')
                  }
                >
                  {displayPassed ? 'LEVEL CLEARED' : 'CUTOFF NOT REACHED'}
                </p>
                <p className="mt-2 font-display text-4xl font-semibold">{displayScore} pts</p>
                <p className="mt-1 font-mono text-xs text-text-muted">
                  needed {cutoff} · found {foundWords.length} word{foundWords.length === 1 ? '' : 's'}
                </p>

                {isRealSession && serverResult?.ratingDelta != null && (
                  <p className="mt-2 font-mono text-xs text-verified">
                    rating {serverResult.ratingDelta >= 0 ? '+' : ''}
                    {serverResult.ratingDelta}
                  </p>
                )}

                {!isAuthenticated && (
                  <p className="mt-3 text-xs text-text-muted">
                    local · unverified —{' '}
                    <Link to="/login" className="text-verified hover:underline">sign in</Link> next
                    time for a real, rated round
                  </p>
                )}
                {sessionError && (
                  <p className="mt-3 font-mono text-xs text-danger">
                    server unreachable ({sessionError}) — showing local score instead
                  </p>
                )}
              </div>

              {serverResult?.achievements?.length > 0 && (
                <div className="mt-6">
                  <p className="font-mono text-xs text-text-muted">new achievements</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {serverResult.achievements.map((type) => (
                      <AchievementBadge key={type} type={type} />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startRound}
                  className="border border-hairline px-4 py-2 text-sm hover:border-verified"
                >
                  {displayPassed ? `Play level ${level}` : 'Retry this level'}
                </button>
                {displayPassed && (
                  <button
                    type="button"
                    onClick={() => setPhase('idle')}
                    className="border border-hairline px-4 py-2 text-sm text-text-muted hover:border-verified"
                  >
                    Back to overview
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  )
}
