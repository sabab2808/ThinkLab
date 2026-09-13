import { Router } from 'express'
import authRoutes from './auth.routes.js'
import gamesRoutes from './games.routes.js'
import sessionsRoutes from './sessions.routes.js'
import ratingsRoutes from './ratings.routes.js'
import achievementsRoutes from './achievements.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/games', gamesRoutes)
router.use('/sessions', sessionsRoutes)
router.use('/ratings', ratingsRoutes)
router.use('/achievements', achievementsRoutes)

export default router
