// In dev, '/api' is proxied to localhost:4000 (see vite.config.js). In a
// real deployment, the frontend and API usually live on different
// domains, so VITE_API_BASE_URL points straight at the deployed API.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new ApiError(data.error || `Request failed with status ${res.status}`, res.status)
  }

  return data
}
