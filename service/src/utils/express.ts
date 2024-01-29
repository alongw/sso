import express from 'express'
import expressJWT from 'express-jwt'
import bodyParser from 'body-parser'
import cors from 'cors'

import logger, { authLogger } from './log'

import { Request } from '../types/express'

import { getBaseUrl, getJwtSecret, getJwtUnless } from './system'

const baseUrl = await getBaseUrl()
const unless = await getJwtUnless()
const jwtSecret = await getJwtSecret()

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('*', (req: Request, res, next) => {
    try {
        req.userIp =
            (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress
    } catch (e) {
        console.log(e)
    }
    if (!req.headers.fingerprint) {
        return res.send({
            status: 451,
            msg: '你说的对，但是《原神》是由米哈游自主研发的一款全新开放世界冒险游戏。游戏发生在一个被称作「提瓦特」的幻想世界，在这里，被神选中的人将被授予「神之眼」，导引元素之力。你将扮演一位名为「旅行者」的神秘角色。在自由的旅行中邂逅性格各异、能力独特的同伴们，和他们一起击败强敌，找回失散的亲人——同时，逐步发掘「原神」的真相。'
        })
    }
    next()
    authLogger.info(
        `ip:${req.userIp}  请求:${req.path}  user-agent:${req.headers['user-agent']}`
    )
})

app.use(
    expressJWT({ secret: jwtSecret, algorithms: ['HS256'] }).unless({
        path: unless.map((e: string) => {
            return new RegExp(`^${baseUrl == '/' ? '' : baseUrl}${e}`)
        })
    })
)

// 错误中间件
app.use(
    (
        err: express.Errback,
        req: express.Request,
        res: express.Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: express.NextFunction
    ) => {
        // 捕获身份认证失败的错误
        if (err.name === 'UnauthorizedError')
            return res.send({
                status: 401,
                msg: '鉴权失败'
            })

        // 其他错误
        if (err.name === 'SyntaxError') {
            return res.send({
                status: 114514,
                msg: '哼！大坏蛋！！！'
            })
        }

        logger.error(`拦截到 express 报错 ${err.name} 具体内容 ${err.toString()}`)
    }
)

export default app
