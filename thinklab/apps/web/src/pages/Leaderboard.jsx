import { useEffect, useState } from 'react'
import { getLeaderboard } from '../services/ratingService.js'

const CATEGORIES = [
  { slug: 'strategy', label: 'Strategy (Tic-Tac-Toe)', color: 'var(--color-strategy)' },
  { slug: 'pathfinding', label: 'Pathfinding (Maze Lab)', color: 'var(--color-pathfinding)' },
  { slug: 'vocabulary', label: 'Vocabulary (Word Search)', color: 'var(--color-vocabulary)' },
]

export default function Leaderboard() {
  const [category, setCategory] = useState(CATEGORIES[0].slug)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getLeaderboard(category)
      .then((data) => {
        if (!cancelled) setRows(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [category])

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="font-mono text-xs text-text-muted">rankings</p>
      <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Leaderboard</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(c.slug)}
            style={category === c.slug ? { borderColor: c.color, color: c.color } : undefined}
            className={
              'border px-3 py-1.5 font-mono text-xs ' +
              (category === c.slug ? '' : 'border-hairline text-text-muted hover:text-text')
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loading && <p className="font-mono text-sm text-text-muted">Loading…</p>}
        {error && (
          <p className="font-mono text-sm text-danger">
            Couldn't load the leaderboard ({error}). Is the API running and connected to MongoDB?
          </p>
        )}
        {!loading && !error && rows.length === 0 && (
          <p className="font-mono text-sm text-text-muted">No verified results in this category yet.</p>
        )}

        {rows.length > 0 && (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline text-left font-mono text-xs text-text-muted">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Player</th>
                <th className="py-2 pr-4">Rating</th>
                <th className="py-2">Games</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {rows.map((row) => (
                <tr key={row.username} className="border-b border-hairline/50">
                  <td className="py-2 pr-4 text-text-muted">{row.rank}</td>
                  <td className="py-2 pr-4">@{row.username}</td>
                  <td className="py-2 pr-4 text-verified">{row.rating}</td>
                  <td className="py-2 text-text-muted">{row.gamesPlayed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
