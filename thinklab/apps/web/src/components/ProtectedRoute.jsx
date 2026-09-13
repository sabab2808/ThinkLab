import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <p className="mx-auto max-w-6xl px-6 py-16 font-mono text-sm text-text-muted">Loading…</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
