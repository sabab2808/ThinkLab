import { apiFetch } from './api.js'

export function registerRequest({ username, email, password }) {
  return apiFetch('/auth/register', { method: 'POST', body: { username, email, password } })
}

export function loginRequest({ email, password }) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } })
}

export function meRequest(token) {
  return apiFetch('/auth/me', { token })
}
