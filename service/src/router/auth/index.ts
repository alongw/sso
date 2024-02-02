import { Router } from 'express'

const router = Router()

router.use('/get', async (req, res, next) =>
    (await import('./get')).default(req, res, next)
)

router.use('/code', async (req, res, next) =>
    (await import('./code')).default(req, res, next)
)

export default router
