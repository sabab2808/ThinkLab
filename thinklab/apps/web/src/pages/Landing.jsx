import ProofTicker from '../components/ProofTicker.jsx'

const pipeline = [
  { step: '01', label: 'Enter the arena', detail: 'Choose a challenge that makes your brain lean forward.' },
  { step: '02', label: 'Leave a trail', detail: 'Every decision is captured, move by move.' },
  { step: '03', label: 'Put it to the test', detail: 'The server replays your run to separate skill from luck.' },
  { step: '04', label: 'Climb', detail: 'A verified result changes your rating in the discipline you played.' },
  { step: '05', label: 'Make it undeniable', detail: 'Earn a public Proof ID for the runs worth showing off.' },
]

const modules = [
  { name: 'Tic-Tac-Toe', tag: 'Minimax', status: 'live' },
  { name: 'Maze Lab', tag: 'BFS · DFS · A*', status: 'live' },
  { name: "Rubik's Cube", tag: '3D solver', status: 'building' },
]

export default function Landing() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid gap-10 py-16 sm:py-24 md:grid-cols-[3fr_2fr] md:items-end md:gap-12">
        <div>
          <p className="font-mono text-xs text-verified">THINK CLEARLY · PLAY BOLDLY</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Outsmart the
            <br />
            board.
            <br />
            Leave proof.
          </h1>
          <p className="mt-6 max-w-md text-text-muted">
            A competitive playground for people who like their puzzles difficult
            and their victories defensible. Play, get tested, and build a record
            that speaks for itself.
          </p>
        </div>
        <div className="border-l border-hairline pl-6 text-sm text-text-muted">
          No inflated scores. No mystery rankings. Your run is reconstructed,
          checked, and counted only when the evidence holds up.
        </div>
      </section>

      <ProofTicker />

      <section className="border-t border-hairline py-12 sm:py-16">
        <h2 className="font-display text-sm font-medium text-text-muted">From first move to hard evidence</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-5">
          {pipeline.map((p) => (
            <li key={p.step} className="border-t border-hairline pt-4">
              <span className="font-mono text-xs text-text-muted">{p.step}</span>
              <h3 className="mt-2 font-display text-base font-medium">{p.label}</h3>
              <p className="mt-2 text-sm text-text-muted">{p.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-hairline py-12 sm:py-16">
        <h2 className="font-display text-sm font-medium text-text-muted">Choose your proving ground</h2>
        <div className="mt-8 divide-y divide-hairline border-y border-hairline">
          {modules.map((m) => (
            <div key={m.name} className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-display text-lg font-medium">{m.name}</h3>
                <p className="font-mono text-xs text-text-muted">{m.tag}</p>
              </div>
              <span
                className={
                  'font-mono text-xs ' +
                  (m.status === 'live' ? 'text-verified' : 'text-live')
                }
              >
                {m.status === 'live' ? 'LIVE' : 'IN PROGRESS'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
