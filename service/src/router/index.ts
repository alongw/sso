import { Router } from 'express'

const router = Router()

router.use('/user', async (req, res, next) =>
    (await import('./user/index.js')).default(req, res, next)
)

router.use('/auth', async (req, res, next) =>
    (await import('./auth/index.js')).default(req, res, next)
)

router.use('/application', async (req, res, next) =>
    (await import('./application/index.js')).default(req, res, next)
)

export default router
