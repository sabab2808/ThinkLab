import ProofTicker from '../components/ProofTicker.jsx'

const pipeline = [
  { step: '01', label: 'Challenge', detail: 'Pick a game or puzzle at your level.' },
  { step: '02', label: 'Event log', detail: 'Every move is recorded with a sequence number.' },
  { step: '03', label: 'Server validation', detail: 'The backend replays your session and checks it.' },
  { step: '04', label: 'Rating', detail: 'A category rating updates from the verified result.' },
  { step: '05', label: 'Proof', detail: 'Qualifying runs get a public, shareable Proof ID.' },
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
          <p className="font-mono text-xs text-verified">play · prove · improve</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Your skill,
            <br />
            demonstrated —
            <br />
            not claimed.
          </h1>
          <p className="mt-6 max-w-md text-text-muted">
            THINKLAB records how you actually play, validates the result on the
            server, and turns it into a rating and a proof you can share.
          </p>
        </div>
        <div className="border-l border-hairline pl-6 text-sm text-text-muted">
          No self-reported scores. No client-side leaderboards. Every
          competitive result is reconstructed and scored server-side before
          it counts.
        </div>
      </section>

      <ProofTicker />

      <section className="border-t border-hairline py-12 sm:py-16">
        <h2 className="font-display text-sm font-medium text-text-muted">How a result becomes proof</h2>
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
        <h2 className="font-display text-sm font-medium text-text-muted">Modules</h2>
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
