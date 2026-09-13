import { Router } from 'express'
import {
  createSession,
  getSession,
  submitEvent,
  finishSession,
} from '../controllers/sessions.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/', requireAuth, createSession)
router.get('/:id', getSession)
router.post('/:id/events', requireAuth, submitEvent)
router.post('/:id/finish', requireAuth, finishSession)

export default router
