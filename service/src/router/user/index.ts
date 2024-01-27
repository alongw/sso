import { Router } from 'express'

const router = Router()

router.use('/login', async (req, res, next) =>
    (await import('./login')).default(req, res, next)
)

router.use('/register', async (req, res, next) =>
    (await import('./register')).default(req, res, next)
)

export default router
