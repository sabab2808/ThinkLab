import { connectDB, disconnectDB } from '../src/config/db.js'
import { Game } from '../src/models/Game.js'
import { logger } from '../src/utils/logger.js'

const games = [
  { slug: 'tic-tac-toe', name: 'Tic-Tac-Toe', category: 'strategy' },
  { slug: 'maze', name: 'Maze Lab', category: 'pathfinding' },
  { slug: 'word-search', name: 'Word Search', category: 'vocabulary' },
]

async function seed() {
  await connectDB()

  for (const game of games) {
    await Game.findOneAndUpdate({ slug: game.slug }, game, { upsert: true })
    logger.info(`Seeded game: ${game.slug}`)
  }

  await disconnectDB()
  logger.info('Seed complete.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
