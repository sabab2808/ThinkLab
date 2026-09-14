import { useState } from 'react'
import { validateFacelets } from '@thinklab/cube-engine'
import FaceCapture from '../../components/FaceCapture.jsx'
import CubeReviewGrid from '../../components/CubeReviewGrid.jsx'
import MoveStepper from '../../components/MoveStepper.jsx'
import { classifyFacelets, CAPTURE_ORDER } from '../../utils/colorScan.js'
import { useCubeSolver } from '../../hooks/useCubeSolver.js'

const DIMENSIONS = [
  { id: '2x2', label: '2×2', ready: false },
  { id: '3x3', label: '3×3', ready: true },
  { id: '4x4', label: '4×4', ready: false },
]

const STAGE = {
  DIMENSION: 'dimension',
  CAPTURING: 'capturing',
  REVIEW: 'review',
  SOLVING: 'solving',
  RESULT: 'result',
}

export default function RubiksCube() {
  const [stage, setStage] = useState(STAGE.DIMENSION)
  const [captureIndex, setCaptureIndex] = useState(0)
  const [rawByFace, setRawByFace] = useState({})
  const [previews, setPreviews] = useState({})
  const [facelets, setFacelets] = useState(null)
  const [validation, setValidation] = useState(null)
  const { status: solveStatus, result: solveResult, error: solveError, solve } = useCubeSolver()

  function startCapture() {
    setCaptureIndex(0)
    setRawByFace({})
    setPreviews({})
    setStage(STAGE.CAPTURING)
  }

  function handleFaceCapture(colors, preview) {
    const face = CAPTURE_ORDER[captureIndex]
    const nextRaw = { ...rawByFace, [face]: colors }
    setRawByFace(nextRaw)
    setPreviews((p) => ({ ...p, [face]: preview }))

    if (captureIndex + 1 < CAPTURE_ORDER.length) {
      setCaptureIndex(captureIndex + 1)
    } else {
      const classified = classifyFacelets(nextRaw)
      setFacelets(classified)
      setValidation(validateFacelets(classified))
      setStage(STAGE.REVIEW)
    }
  }

  function handleCorrect(face, index, newLabel) {
    const next = { ...facelets, [face]: facelets[face].map((c, i) => (i === index ? newLabel : c)) }
    setFacelets(next)
    setValidation(validateFacelets(next))
  }

  function runSolve() {
    setStage(STAGE.SOLVING)
    solve(facelets)
  }

  if (solveStatus === 'done' && stage !== STAGE.RESULT) setStage(STAGE.RESULT)

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="font-mono text-xs text-text-muted">optimization</p>
      <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Rubik's Cube</h1>

      {stage === STAGE.DIMENSION && (
        <>
          <p className="mt-2 text-sm text-text-muted sm:text-base">Hand the scramble to the machine. See how far your cube can be brought back from chaos.</p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {DIMENSIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                disabled={!d.ready}
                onClick={startCapture}
                className={
                  'border p-3 text-center sm:p-6 ' +
                  (d.ready ? 'border-hairline hover:border-verified' : 'border-hairline opacity-40 cursor-not-allowed')
                }
              >
                <p className="font-display text-lg sm:text-2xl">{d.label}</p>
                <p className="mt-2 font-mono text-[10px] text-text-muted">
                  {d.ready ? 'READY' : 'COMING SOON'}
                </p>
              </button>
            ))}
          </div>
          <p className="mt-6 text-xs text-text-muted">
            Only 3×3 is implemented right now — 2×2 and 4×4 need genuinely different
            solving methods (parity handling, reduction) that aren't built yet.
          </p>
        </>
      )}

      {stage === STAGE.CAPTURING && (
        <div className="mt-6">
          <p className="text-sm text-text-muted">
            Photo {captureIndex + 1} of 6. Hold the cube steady, align the face inside the
            grid, then capture.
          </p>
          <div className="mt-4">
            <FaceCapture label={CAPTURE_ORDER[captureIndex]} onCapture={handleFaceCapture} />
          </div>
          <div className="mt-4 flex gap-2">
            {CAPTURE_ORDER.map((f, i) => (
              <div
                key={f}
                className={
                  'h-1.5 flex-1 ' + (i < captureIndex ? 'bg-verified' : i === captureIndex ? 'bg-live' : 'bg-hairline')
                }
              />
            ))}
          </div>
        </div>
      )}

      {stage === STAGE.REVIEW && facelets && (
        <div className="mt-6">
          <p className="text-sm text-text-muted">
            Check each face. Tap any cell to correct a misread color before solving.
          </p>

          <div className="mt-6">
            <CubeReviewGrid facelets={facelets} onChange={handleCorrect} />
          </div>

          {validation && !validation.valid && (
            <div className="mt-4 border border-danger p-3">
              <p className="font-mono text-xs text-danger">Scan looks invalid:</p>
              <ul className="mt-2 list-disc pl-5 text-xs text-text-muted">
                {validation.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={runSolve}
              disabled={!validation?.valid}
              className="border border-hairline px-4 py-2 text-sm hover:border-verified disabled:opacity-40"
            >
              Solve
            </button>
            <button
              type="button"
              onClick={startCapture}
              className="border border-hairline px-4 py-2 text-sm hover:border-verified"
            >
              Re-scan
            </button>
          </div>
        </div>
      )}

      {stage === STAGE.SOLVING && (
        <div className="mt-10 flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-live" />
          <p className="font-mono text-sm text-text-muted">
            Solving… this can take anywhere from a second to about a minute depending on the scramble.
          </p>
        </div>
      )}

      {stage === STAGE.RESULT && solveResult && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={
                'font-mono text-xs ' + (solveResult.fullySolved ? 'text-verified' : 'text-live')
              }
            >
              {solveResult.fullySolved
                ? 'FULLY SOLVED'
                : solveResult.f2lComplete
                  ? 'FIRST TWO LAYERS SOLVED — last layer needs manual finishing'
                  : 'PARTIALLY SOLVED'}
            </span>
            <span className="font-mono text-xs text-text-muted">{solveResult.moves.length} moves</span>
          </div>

          {!solveResult.fullySolved && (
            <p className="mt-2 text-xs text-text-muted">
              This engine's last-layer solver only uses a handful of algorithms I've
              directly verified — it doesn't yet cover every possible case. Follow the
              moves below for as far as they go; the rest of the cube may need finishing
              by hand.
            </p>
          )}

          <div className="mt-6">
            <MoveStepper moves={solveResult.moves} />
          </div>
        </div>
      )}

      {solveStatus === 'error' && (
        <p className="mt-6 font-mono text-xs text-danger">Solve failed: {solveError}</p>
      )}
    </main>
  )
}
