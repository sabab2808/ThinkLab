import { useState } from 'react'

export default function MoveStepper({ moves }) {
  const [step, setStep] = useState(0)

  if (moves.length === 0) {
    return <p className="font-mono text-sm text-text-muted">Already solved — no moves needed.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-3 border border-hairline py-6 sm:gap-6 sm:py-10">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="font-mono text-xl text-text-muted hover:text-text disabled:opacity-30 sm:text-2xl"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="font-display text-4xl font-semibold sm:text-5xl">{moves[step]}</p>
          <p className="mt-2 font-mono text-xs text-text-muted">
            move {step + 1} / {moves.length}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(moves.length - 1, s + 1))}
          disabled={step === moves.length - 1}
          className="font-mono text-xl text-text-muted hover:text-text disabled:opacity-30 sm:text-2xl"
        >
          ›
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-xs">
        {moves.map((m, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            className={
              'border px-2 py-1 ' +
              (i === step ? 'border-verified text-verified' : 'border-hairline text-text-muted hover:text-text')
            }
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}
