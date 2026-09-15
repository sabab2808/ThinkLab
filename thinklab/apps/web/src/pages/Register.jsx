import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register({ username, email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold">Create an account</h1>
      <p className="mt-2 text-sm text-text-muted">
        Already registered? <Link to="/login" className="text-verified hover:underline">Sign in</Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          Username
          <input
            type="text"
            required
            minLength={3}
            maxLength={32}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-hairline bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-verified"
          />
        </label>

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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-hairline bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-verified"
          />
          <span className="font-mono text-[11px] text-text-muted">At least 8 characters.</span>
        </label>

        {error && <p className="font-mono text-xs text-danger">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 border border-hairline px-4 py-2 text-sm hover:border-verified disabled:opacity-50"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </main>
  )
}
