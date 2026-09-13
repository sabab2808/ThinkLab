import { User } from '../models/User.js'
import { hashPassword, verifyPassword, signToken } from '../services/auth.service.js'
import { validateRegister, validateLogin } from '../validators/auth.validator.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { AppError } from '../utils/AppError.js'

function toPublicUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    verified: user.verified,
    createdAt: user.createdAt,
  }
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  validateRegister(req.body)
  const { username, email, password } = req.body

  const existing = await User.findOne({ $or: [{ username }, { email }] })
  if (existing) {
    throw new AppError('Username or email is already taken', 409)
  }

  const passwordHash = await hashPassword(password)
  const user = await User.create({ username, email, passwordHash })

  const token = signToken(user)
  res.status(201).json({ user: toPublicUser(user), token })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  validateLogin(req.body)
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+passwordHash')
  if (!user) throw new AppError('Invalid email or password', 401)

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) throw new AppError('Invalid email or password', 401)

  const token = signToken(user)
  res.json({ user: toPublicUser(user), token })
})

// GET /api/auth/me — requires requireAuth middleware to have run first
export const me = asyncHandler(async (req, res) => {
  res.json({ user: toPublicUser(req.user) })
})
