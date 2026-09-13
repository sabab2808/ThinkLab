/**
 * A verification result rendered like a stamp, not a generic badge.
 * `status`: 'verifying' | 'verified' | 'rejected'
 */
export default function VerificationStamp({ status, proofId }) {
  if (status === 'verifying') {
    return (
      <span className="inline-flex items-center gap-2 font-mono text-xs text-live">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />
        VERIFYING…
      </span>
    )
  }

  if (status === 'rejected') {
    return (
      <span className="inline-block -rotate-3 border-2 border-danger px-3 py-1 font-mono text-xs font-medium tracking-widest text-danger">
        REJECTED
      </span>
    )
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <span className="inline-block -rotate-3 border-2 border-verified px-3 py-1 font-mono text-xs font-medium tracking-widest text-verified">
        VERIFIED
      </span>
      {proofId && (
        <span className="font-mono text-[10px] text-text-muted">{proofId}</span>
      )}
    </span>
  )
}
