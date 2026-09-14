import { Link } from 'react-router-dom'

const games = [
  { name: 'Tic-Tac-Toe', path: '/games/tic-tac-toe', category: 'Strategy', ready: true, color: 'coral', image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=900&q=85', blurb: 'Read the board. Outsmart the next move.' },
  { name: 'Maze Lab', path: '/games/maze', category: 'Pathfinding', ready: true, color: 'sky', image: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&w=900&q=85', blurb: 'Race four algorithms to the finish.' },
  { name: "Rubik's Cube", path: '/games/rubik', category: 'Optimization', ready: true, color: 'lilac', image: 'https://images.unsplash.com/photo-1591991564021-0662a8573199?auto=format&fit=crop&w=900&q=85', blurb: 'Find order inside a colorful scramble.' },
  { name: 'Word Forge', path: '/games/word-sudoku', category: 'Wordplay', ready: true, color: 'live', image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=900&q=85', blurb: 'Spot hidden words and build your streak.' },
]

export default function GameHub() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-xs text-live">THE PLAYGROUND</p>
      <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">Choose your next brain adventure.</h1>
      <p className="mt-3 max-w-xl text-text-muted">Four ways to play, think, and surprise yourself. Every challenge tests a different kind of thinking.</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {games.map((g) => (
          <Link
            key={g.name}
            to={g.ready ? g.path : '#'}
            className={
              'group relative block min-h-72 overflow-hidden border border-hairline ' +
              (g.ready ? 'hover:border-verified' : 'opacity-50 cursor-not-allowed')
            }
            style={{ backgroundImage: `url(${g.image})` }}
          >
            <div className="game-card-art absolute inset-0" />
            <div className="relative z-10 flex h-full min-h-72 flex-col justify-end p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-white/70">{g.category}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">{g.name}</h2>
              <p className="mt-1 max-w-xs text-sm text-white/80">{g.blurb}</p>
              <p className="mt-5 font-mono text-xs text-verified">{g.ready ? 'PLAY NOW →' : 'IN THE WORKSHOP'}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
