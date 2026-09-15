import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { getUserRatings } from '../services/ratingService.js'
import { getUserAchievements } from '../services/achievementService.js'
import AchievementBadge from '../components/AchievementBadge.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [ratings, setRatings] = useState(null)
  const [achievements, setAchievements] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([getUserRatings(user.username), getUserAchievements(user.username)])
      .then(([ratingsData, achievementsData]) => {
        if (cancelled) return
        setRatings(ratingsData.ratings)
        setAchievements(achievementsData.achievements)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [user.username])

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs text-verified">signed in</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">@{user.username}</h1>

      {error && (
        <p className="mt-6 font-mono text-xs text-danger">Couldn't load your data ({error}).</p>
      )}

      <div className="mt-10 border-t border-hairline pt-6">
        <h2 className="font-display text-sm font-medium text-text-muted">Ratings</h2>

        {!error && ratings && ratings.length === 0 && (
          <p className="mt-3 text-sm text-text-muted">
            No verified sessions yet.{' '}
            <Link to="/games" className="text-verified hover:underline">Play a game</Link> to start building a rating.
          </p>
        )}

        {ratings && ratings.length > 0 && (
          <div className="mt-4 divide-y divide-hairline border-y border-hairline font-mono text-sm">
            {ratings.map((r) => (
              <div key={r.category} className="flex items-center justify-between py-3">
                <span className="capitalize text-text-muted">{r.category}</span>
                <span style={{ color: `var(--color-${r.category}, var(--color-verified))` }}>
                  {Math.round(r.rating)}
                </span>
                <span className="text-text-muted">{r.gamesPlayed} played</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-hairline pt-6">
        <h2 className="font-display text-sm font-medium text-text-muted">Achievements</h2>

        {!error && achievements && achievements.length === 0 && (
          <p className="mt-3 text-sm text-text-muted">None earned yet — they unlock automatically as you play.</p>
        )}

        {achievements && achievements.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {achievements.map((a) => (
              <AchievementBadge key={a._id} type={a.type} issuedAt={a.issuedAt} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
