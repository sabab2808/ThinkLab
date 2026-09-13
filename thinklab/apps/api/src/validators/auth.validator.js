import { AppError } from '../utils/AppError.js'

const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRegister(body) {
  const { username, email, password } = body

  if (!username || !USERNAME_RE.test(username)) {
    throw new AppError('Username must be 3-32 characters: letters, numbers, underscores only', 400)
  }
  if (!email || !EMAIL_RE.test(email)) {
    throw new AppError('A valid email is required', 400)
  }
  if (!password || password.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400)
  }
}

export function validateLogin(body) {
  if (!body.email) throw new AppError('Email is required', 400)
  if (!body.password) throw new AppError('Password is required', 400)
}
