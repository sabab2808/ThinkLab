import { logger } from '../utils/logger.js'
import { isProduction } from '../config/env.js'

// Must be registered last, after all routes. Express identifies error
// middleware by arity — this needs all four parameters even though `next`
// is unused, or Express won't treat it as an error handler.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  // Mongoose validation errors and bad ObjectId casts are common enough
  // to translate into clean 4xx responses instead of leaking a 500.
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors).map((e) => e.message).join(', ')
  }
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid value for ${err.path}: ${err.value}`
  }
  if (err.code === 11000) {
    statusCode = 409
    message = 'Duplicate value violates a unique constraint'
  }

  if (statusCode >= 500) {
    logger.error(err)
  }

  res.status(statusCode).json({
    error: message,
    ...(isProduction ? {} : { stack: err.stack }),
  })
}
