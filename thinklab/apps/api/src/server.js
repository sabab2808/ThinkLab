import { createApp } from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'
import { logger } from './utils/logger.js'

async function main() {
  await connectDB()
  const app = createApp()

  app.listen(env.port, () => {
    logger.info(`THINKLAB API listening on :${env.port}`)
  })
}

main().catch((err) => {
  logger.error('Fatal startup error:', err)
  process.exit(1)
})
