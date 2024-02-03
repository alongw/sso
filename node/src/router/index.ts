import { Router } from 'express'

const router = Router()

router.use('/v0', async (req, res, next) =>
    (await import('./v0/index.js')).default(req, res, next)
)

// router.use('/auth', async (req, res, next) =>
//     (await import('./auth/index')).default(req, res, next)
// )

export default router
