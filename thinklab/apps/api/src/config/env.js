// Single source of truth for environment variables. Nothing else in the
// codebase should read `process.env` directly — that keeps every required
// variable documented in one place and fails fast with a clear error
// instead of surfacing as an undefined-is-not-a-function three modules away.
import 'dotenv/config'

function required(name, fallback) {
  const value = process.env[name] ?? fallback
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/thinklab'),
  jwtSecret: required('JWT_SECRET', 'dev-secret-change-me'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}

export const isProduction = env.nodeEnv === 'production'
