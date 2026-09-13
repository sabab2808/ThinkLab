// A typed error carrying an HTTP status code, so route handlers can throw
// a single class instead of manually calling res.status().json() at every
// failure point. The centralized error middleware (middleware/errorHandler.js)
// is what actually reads .statusCode off this.
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}
