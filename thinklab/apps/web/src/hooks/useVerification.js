import { useEffect, useState } from 'react'

/**
 * Drives the "verification moment": once a game ends, this steps through
 * the event log on a timer — visibly replaying it — before flipping to
 * 'verified'. This is standing in for the real thing: once /sessions/:id
 * /finish exists, the server does this replay and this hook just displays
 * whatever step the server confirms instead of faking the timing locally.
 *
 * Returns { status, step } where status is 'verifying' | 'verified'.
 */
export function useVerificationSequence(events, { active, stepMs = 220 } = {}) {
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    if (!active) return
    setStep(0)
    setStatus('verifying')

    if (events.length === 0) {
      setStatus('verified')
      return
    }

    let i = 0
    const id = setInterval(() => {
      i += 1
      setStep(i)
      if (i >= events.length) {
        clearInterval(id)
        setStatus('verified')
      }
    }, stepMs)

    return () => clearInterval(id)
  }, [active, events, stepMs])

  return { status, step }
}
