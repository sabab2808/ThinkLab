import { Router } from 'express'
import { getUserAchievements } from '../controllers/achievements.controller.js'

const router = Router()

router.get('/user/:username', getUserAchievements)

export default router
