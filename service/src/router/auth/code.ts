import { Router } from 'express'
import dayjs from 'dayjs'

import { Op } from 'sequelize'

import checkValue from './../../utils/checkValue.js'
import { encrypt } from './../../utils/crypt.js'

import { AuthLog, Application } from './../../database/table.js'

import logger, { authLogger } from './../../utils/log.js'

import type { Request } from './../../types/request.js'

const router = Router()

router.post(
    '/',
    async (
        req: Request<{
            appid: string | undefined
            permissionList: number[] | undefined
            state: string | undefined
        }>,
        res
    ) => {
        if (!checkValue(req.body?.appid, req.body?.permissionList))
            return res.send({
                status: 400,
                msg: '参数错误'
            })

        // 获取 app
        const app = await Application.findOne({
            where: {
                appid: req.body.appid
            }
        })

        if (!app) {
            return res.send({
                status: 404,
                msg: '应用程序不存在'
            })
        }

        let authId = null

        // 判断近期是否频繁授权
        const count = await AuthLog.count({
            where: {
                uid: req.user.uid,
                appid: req.body.appid,
                time: {
                    [Op.gte]: dayjs().subtract(1, 'h').valueOf()
                }
            }
        })

        if (count > 10) {
            logger.info(
                `用户 ${req.user.uid} 授权应用 ${req.body.appid} 过于频繁，去了，因此拦截授权请求`
            )
            return res.send({
                status: 403,
                msg: '不...不行...太快了...请...请慢一点...❤'
            })
        }

        try {
            const db = await AuthLog.create({
                uid: req.user.uid,
                appid: req.body.appid,
                ip: (req.headers['x-real-ip'] || req.ip).toString(),
                time: dayjs().valueOf(),
                exp: dayjs().add(5, 'minute').valueOf(),
                ua: req.headers['user-agent'],
                fingerprint: req.headers.fingerprint
            })
            authId = db.toJSON().id
        } catch (error) {
            logger.error(error)
        }

        // 分发 code
        const code = encrypt(
            JSON.stringify({
                uid: req.user.uid,
                appid: req.body.appid,
                permissionList: req.body.permissionList,
                time: dayjs().valueOf(),
                exp: dayjs().add(5, 'minute').valueOf(),
                authId
            })
        )

        authLogger.info(
            `用户 ${req.user.uid} 授权应用 ${req.body.appid} 权限 ${req.body.permissionList} 生成 code `
        )

        return res.send({
            status: 200,
            msg: '获取 code 成功',
            data: {
                code,
                exp: dayjs().add(5, 'minute').valueOf(),
                state: req.body.state ? req.body.state : '',
                appid: req.body.appid,
                redirect: app.get('redirect')
            }
        })
    }
)

export default router
