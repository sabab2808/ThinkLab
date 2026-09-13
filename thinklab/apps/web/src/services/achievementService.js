import { apiFetch } from './api.js'

export function getUserAchievements(username) {
  return apiFetch(`/achievements/user/${username}`)
}
