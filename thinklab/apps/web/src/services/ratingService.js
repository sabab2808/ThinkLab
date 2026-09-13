import { apiFetch } from './api.js'

export function getUserRatings(username) {
  return apiFetch(`/ratings/user/${username}`)
}

export function getLeaderboard(category, limit = 20) {
  return apiFetch(`/ratings/leaderboard/${category}?limit=${limit}`)
}
