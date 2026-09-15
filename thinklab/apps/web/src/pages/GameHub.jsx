import { Link } from 'react-router-dom'
import TicTacToeIcon from '../components/icons/TicTacToeIcon.jsx'
import MazeIcon from '../components/icons/MazeIcon.jsx'
import CubeIcon from '../components/icons/CubeIcon.jsx'
import WordSearchIcon from '../components/icons/WordSearchIcon.jsx'

const games = [
  {
    name: 'Tic-Tac-Toe',
    path: '/games/tic-tac-toe',
    category: 'Strategy',
    color: 'var(--color-strategy)',
    Icon: TicTacToeIcon,
    ready: true,
  },
  {
    name: 'Maze Lab',
    path: '/games/maze',
    category: 'Pathfinding',
    color: 'var(--color-pathfinding)',
    Icon: MazeIcon,
    ready: true,
  },
  {
    name: "Rubik's Cube",
    path: '/games/rubik',
    category: 'Optimization',
    color: 'var(--color-optimization)',
    Icon: CubeIcon,
    ready: true,
  },
  {
    name: 'Word Search',
    path: '/games/word-search',
    category: 'Vocabulary',
    color: 'var(--color-vocabulary)',
    Icon: WordSearchIcon,
    ready: true,
  },
]

export default function GameHub() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Game hub</h1>
      <p className="mt-2 text-text-muted">Pick a challenge. Verified sessions count toward your rating.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {games.map((g) => (
          <Link
            key={g.name}
            to={g.ready ? g.path : '#'}
            style={{ '--hover-color': g.color }}
            className={
              'group block border border-hairline p-5 transition-colors hover:border-[var(--hover-color)] ' +
              (g.ready ? '' : 'opacity-50 cursor-not-allowed')
            }
          >
            <g.Icon className="h-14 w-14" />
            <p className="mt-4 font-mono text-xs" style={{ color: g.color }}>
              {g.category}
            </p>
            <h2 className="mt-1 font-display text-lg font-medium">{g.name}</h2>
            <p className="mt-3 font-mono text-xs text-verified">
              {g.ready ? 'PLAY' : 'COMING SOON'}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
