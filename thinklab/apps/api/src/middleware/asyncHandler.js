// Express doesn't catch rejected promises from async route handlers on
// its own — an unhandled rejection just hangs the request. Wrapping every
// async controller in this once means no controller needs its own
// try/catch just to forward errors to next().
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
