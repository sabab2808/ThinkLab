import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import apiRoutes from './routes/index.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.corsOrigin }))
  app.use(express.json())

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
  app.use('/api', apiRoutes)

  app.use(notFound)
  app.use(errorHandler) // must be last

  return app
}
