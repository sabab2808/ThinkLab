// Thin wrapper around console so call sites read `logger.info(...)` instead
// of bare `console.log`, and there's exactly one place to swap in a real
// logging library (pino, winston) later without touching every file that
// logs something.
const timestamp = () => new Date().toISOString()

export const logger = {
  info: (...args) => console.log(`[${timestamp()}] INFO`, ...args),
  warn: (...args) => console.warn(`[${timestamp()}] WARN`, ...args),
  error: (...args) => console.error(`[${timestamp()}] ERROR`, ...args),
}
