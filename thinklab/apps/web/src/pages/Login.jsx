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
      <p className="font-mono text-xs text-verified">RETURN TO THE LAB</p>
      <h1 className="mt-2 font-display text-2xl font-semibold">Pick up your record.</h1>
      <p className="mt-2 text-sm text-text-muted">
        New to the arena? <Link to="/register" className="text-verified hover:underline">Create your player record</Link>
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
          {submitting ? 'Opening your record…' : 'Enter the lab'}
        </button>
      </form>
    </main>
  )
}
