import express from 'express'
import expressJWT from 'express-jwt'
import bodyParser from 'body-parser'
import cors from 'cors'

import logger, { authLogger } from './log'

import { Request } from '../types/request'

import { getNodeBaseUrl, getNodeSecret, getJwtUnless } from './system'

const baseUrl = await getNodeBaseUrl()
const unless = await getJwtUnless()
const jwtSecret = await getNodeSecret()

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
    // if (!req.headers.fingerprint) {
    //     return res.send({
    //         status: 451,
    //         msg: '你说的部分是正确的，但也有一些不完全正确。从某种角度来看，你的观点是有一定道理的，但从另一个角度来看，你的观点又存在一些偏差。不能说完全是错误的，只能说在完全正确之前存在一些不准确的地方。如果忽略这些不准确之处，你的观点当然是正确的，但如果以更严谨的态度来审视你的观点是否正确，就会发现其中的不正确之处。实际上，如果仔细思考，你所说的正确之处可能在静止的世界中是正确的，但在运动的时空中可能是错误的。相反，你所说的不正确之处从辩证的观点来看可能是正确的。此时此刻，你所说的可能是对的，也可能是不对的，而在未来，你所说的可能是不对的，也可能是对的。总的来说，根据全面的观点来评述，知晓过去、现在和未来，方可得出结论。'
    //     })
    // }
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
