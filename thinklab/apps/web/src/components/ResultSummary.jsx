import VerificationStamp from './VerificationStamp.jsx'

export default function ResultSummary({ title, detail, status, proofId, ratingDelta, children }) {
  return (
    <section className="result-panel border border-verified/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-verified">CHALLENGE COMPLETE</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-text-muted">{detail}</p>
        </div>
        <VerificationStamp status={status} proofId={status === 'verified' ? proofId : undefined} />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {ratingDelta != null && (
          <div className="border border-verified/40 bg-ink/20 px-3 py-2">
            <p className="font-mono text-[10px] uppercase text-text-muted">RATING CHANGE</p>
            <p className="mt-1 font-display text-xl text-verified">{ratingDelta >= 0 ? '+' : ''}{ratingDelta}</p>
          </div>
        )}
        {children}
      </div>
    </section>
  )
}