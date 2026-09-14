import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Nav() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="font-display text-base font-semibold tracking-tight sm:text-lg">
          THINKLAB
        </Link>
        <nav className="flex items-center gap-3 text-xs text-text-muted sm:gap-8 sm:text-sm">
          <Link to="/games" className="hover:text-text">Enter arena</Link>
          <Link to="/leaderboard" className="hidden hover:text-text sm:inline">Leaderboard</Link>
          <Link to="/dashboard" className="hover:text-text">My record</Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-xs text-text sm:inline">@{user.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded border border-hairline px-2.5 py-1 text-text hover:border-danger hover:text-danger transition-colors sm:px-3 sm:py-1.5"
              >
                Leave arena
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded border border-hairline px-2.5 py-1 text-text hover:border-verified hover:text-verified transition-colors sm:px-3 sm:py-1.5"
            >
              Join the lab
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
