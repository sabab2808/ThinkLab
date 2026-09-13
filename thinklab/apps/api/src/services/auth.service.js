import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

const SALT_ROUNDS = 10
const TOKEN_TTL = '7d'

export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), username: user.username }, env.jwtSecret, {
    expiresIn: TOKEN_TTL,
  })
}

export function verifyToken(token) {
  // Throws on an invalid/expired token — callers decide how to translate
  // that into an HTTP response (see middleware/auth.js).
  return jwt.verify(token, env.jwtSecret)
}
