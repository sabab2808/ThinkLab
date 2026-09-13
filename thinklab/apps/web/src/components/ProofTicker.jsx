import { generateProofId } from '../utils/proofId.js'

// Placeholder feed — once /sessions/:id/finish is real, this subscribes to
// actual verified results instead of hardcoded rows. Shape is intentionally
// identical to a real proof row so swapping the data source is the only
// change needed later.
const DEMO_PROOFS = [
  { user: '@marek', game: 'Tic-Tac-Toe', result: 'won in 5 moves' },
  { user: '@ines', game: 'Maze Lab', result: 'optimal path, A*' },
  { user: '@yusuf', game: 'Tic-Tac-Toe', result: 'draw, perfect play' },
  { user: '@priya', game: "Rubik's Cube", result: '19 moves' },
  { user: '@theo', game: 'Maze Lab', result: '2.1s, BFS' },
]

const rows = DEMO_PROOFS.map((p) => ({ ...p, proofId: generateProofId() }))

export default function ProofTicker() {
  const doubled = [...rows, ...rows]

  return (
    <div className="overflow-hidden border-y border-hairline py-3">
      <div className="flex w-max animate-ticker gap-10">
        {doubled.map((p, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap font-mono text-xs text-text-muted">
            <span className="text-verified">VERIFIED</span>
            <span>{p.user}</span>
            <span>·</span>
            <span>{p.game}</span>
            <span>·</span>
            <span>{p.result}</span>
            <span className="text-text-muted/60">{p.proofId}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
