import { Router } from 'express'

const router = Router()

router.use('/login', async (req, res, next) =>
    (await import('./login.js')).default(req, res, next)
)

router.use('/register', async (req, res, next) =>
    (await import('./register.js')).default(req, res, next)
)

router.use('/perfect', async (req, res, next) =>
    (await import('./perfect.js')).default(req, res, next)
)

router.use('/info', async (req, res, next) =>
    (await import('./info.js')).default(req, res, next)
)

router.use('/', async (req, res, next) =>
    (await import('./beforeLogin.js')).default(req, res, next)
)

export default router
