import { apiFetch } from './api.js'

export function createSessionRequest(gameSlug, token, opponentOptions = {}) {
  return apiFetch('/sessions', { method: 'POST', body: { gameSlug, ...opponentOptions }, token })
}

export function submitEventRequest(sessionId, event, token) {
  return apiFetch(`/sessions/${sessionId}/events`, { method: 'POST', body: event, token })
}

export function finishSessionRequest(sessionId, token) {
  return apiFetch(`/sessions/${sessionId}/finish`, { method: 'POST', token })
}
