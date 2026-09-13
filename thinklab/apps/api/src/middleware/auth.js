import { verifyToken } from '../services/auth.service.js'
import { User } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from './asyncHandler.js'

/**
 * Protects a route: requires a valid `Authorization: Bearer <token>` header.
 * Attaches the authenticated user to `req.user` (without passwordHash).
 */
export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    throw new AppError('Missing or malformed Authorization header', 401)
  }

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    throw new AppError('Invalid or expired token', 401)
  }

  const user = await User.findById(payload.sub)
  if (!user) throw new AppError('User no longer exists', 401)

  req.user = user
  next()
})
