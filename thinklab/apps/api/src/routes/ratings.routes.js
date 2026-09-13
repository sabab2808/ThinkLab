import { Router } from 'express'
import { getUserRatings, getLeaderboard } from '../controllers/ratings.controller.js'

const router = Router()

router.get('/user/:username', getUserRatings)
router.get('/leaderboard/:category', getLeaderboard)

export default router
