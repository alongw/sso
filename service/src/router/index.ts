import { Router } from 'express'

const router = Router()

router.use('/user', async (req, res, next) =>
    (await import('./user/index')).default(req, res, next)
)

router.use('/auth', async (req, res, next) =>
    (await import('./auth/index')).default(req, res, next)
)

export default router
