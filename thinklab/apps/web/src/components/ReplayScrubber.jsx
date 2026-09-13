import { useEffect, useRef, useState } from 'react'

/**
 * Scrubs through an event log, like a video editor timeline.
 *
 * `events`: array of logged events (moves), length N.
 * `renderStep(step)`: given a step 0..N (how many events have been
 *   applied), returns whatever the caller wants to show for that point
 *   in the game — usually a reconstructed board. Reconstruction logic
 *   stays with the caller since it's game-specific; this component only
 *   owns the timeline scrubbing.
 *
 * Starts at the final step (the completed game) since that's what you
 * land on right after finishing — scrubbing backward is the point.
 */
export default function ReplayScrubber({ events, renderStep }) {
  const [step, setStep] = useState(events.length)
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!playing) return
    intervalRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= events.length) {
          setPlaying(false)
          return s
        }
        return s + 1
      })
    }, 600)
    return () => clearInterval(intervalRef.current)
  }, [playing, events.length])

  function togglePlay() {
    if (step >= events.length) setStep(0) // replay from the start
    setPlaying((p) => !p)
  }

  return (
    <div>
      <div>{renderStep(step)}</div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="border border-hairline px-3 py-1.5 font-mono text-xs hover:border-verified"
        >
          {playing ? 'PAUSE' : step >= events.length ? 'REPLAY' : 'PLAY'}
        </button>

        <input
          type="range"
          min={0}
          max={events.length}
          value={step}
          onChange={(e) => {
            setPlaying(false)
            setStep(Number(e.target.value))
          }}
          className="flex-1 accent-verified"
        />

        <span className="w-14 shrink-0 text-right font-mono text-xs text-text-muted">
          {step}/{events.length}
        </span>
      </div>
    </div>
  )
}
