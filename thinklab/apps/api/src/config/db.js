import mongoose from 'mongoose'
import { env } from './env.js'
import { logger } from '../utils/logger.js'

mongoose.set('strictQuery', true)

export async function connectDB() {
  mongoose.connection.on('connected', () => {
    logger.info(`MongoDB connected → ${mongoose.connection.name}`)
  })
  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', err)
  })
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected')
  })

  await mongoose.connect(env.mongoUri)
  return mongoose.connection
}

export async function disconnectDB() {
  await mongoose.disconnect()
}
