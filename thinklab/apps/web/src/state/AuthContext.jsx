import { createContext, useContext, useEffect, useState } from 'react'
import { registerRequest, loginRequest, meRequest } from '../services/authService.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'thinklab_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  // On first load, if a token is already stored, verify it's still valid
  // and rehydrate the user instead of trusting the stored token blindly.
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    meRequest(token)
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  function persistSession({ user, token }) {
    localStorage.setItem(TOKEN_KEY, token)
    setToken(token)
    setUser(user)
  }

  async function register(fields) {
    const data = await registerRequest(fields)
    persistSession(data)
    return data.user
  }

  async function login(fields) {
    const data = await loginRequest(fields)
    persistSession(data)
    return data.user
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const value = { user, token, loading, isAuthenticated: Boolean(user), register, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
