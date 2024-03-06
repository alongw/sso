import { Router } from 'express'

const router = Router()

router.use('/login', async (req, res, next) =>
    (await import('./login')).default(req, res, next)
)

router.use('/register', async (req, res, next) =>
    (await import('./register')).default(req, res, next)
)

router.use('/perfect', async (req, res, next) =>
    (await import('./perfect')).default(req, res, next)
)

router.use('/info', async (req, res, next) =>
    (await import('./info')).default(req, res, next)
)

router.use('/', async (req, res, next) =>
    (await import('./beforeLogin')).default(req, res, next)
)

export default router
