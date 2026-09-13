import { Link } from 'react-router-dom'

const games = [
  { name: 'Tic-Tac-Toe', path: '/games/tic-tac-toe', category: 'Strategy', ready: true },
  { name: 'Maze Lab', path: '/games/maze', category: 'Pathfinding', ready: true },
  { name: "Rubik's Cube", path: '/games/rubik', category: 'Optimization', ready: true },
]

export default function GameHub() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Game hub</h1>
      <p className="mt-2 text-text-muted">Pick a challenge. Verified sessions count toward your rating.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {games.map((g) => (
          <Link
            key={g.name}
            to={g.ready ? g.path : '#'}
            className={
              'block border border-hairline p-5 transition-colors ' +
              (g.ready ? 'hover:border-verified' : 'opacity-50 cursor-not-allowed')
            }
          >
            <p className="font-mono text-xs text-text-muted">{g.category}</p>
            <h2 className="mt-2 font-display text-lg font-medium">{g.name}</h2>
            <p className="mt-3 font-mono text-xs text-verified">
              {g.ready ? 'PLAY' : 'COMING SOON'}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
