import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ email, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-text-muted">
        No account? <Link to="/register" className="text-verified hover:underline">Register</Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-hairline bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-verified"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-hairline bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-verified"
          />
        </label>

        {error && <p className="font-mono text-xs text-danger">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 border border-hairline px-4 py-2 text-sm hover:border-verified disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
