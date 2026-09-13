import { useCallback, useRef, useState } from 'react'

/**
 * Runs the cube solver in a Web Worker so a slow solve (see
 * docs/cube-engine.md — this can genuinely take anywhere from under a
 * second to a minute) never freezes the page.
 */
export function useCubeSolver() {
  const [status, setStatus] = useState('idle') // idle | solving | done | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const workerRef = useRef(null)

  const solve = useCallback((facelets) => {
    setStatus('solving')
    setResult(null)
    setError(null)

    const worker = new Worker(new URL('../workers/cubeSolver.worker.js', import.meta.url), {
      type: 'module',
    })
    workerRef.current = worker

    worker.onmessage = (event) => {
      const { ok, result: r, error: e } = event.data
      if (ok) {
        setResult(r)
        setStatus('done')
      } else {
        setError(e)
        setStatus('error')
      }
      worker.terminate()
    }

    worker.onerror = (event) => {
      setError(event.message || 'Worker error')
      setStatus('error')
      worker.terminate()
    }

    worker.postMessage({ facelets })
  }, [])

  return { status, result, error, solve }
}
