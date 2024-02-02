import { Router } from 'express'
import dayjs from 'dayjs'

import checkValue from './../../utils/checkValue'
import { encrypt } from './../../utils/crypt'

import { AuthLog, Application } from './../../database/table'

import logger, { authLogger } from './../../utils/log'

import type { Request } from './../../types/request'

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
        if (!checkValue(req.body, req.body.appid, req.body.permissionList))
            return res.send({
                status: 400,
                message: '参数错误'
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

        // 分发 code
        const code = encrypt(
            JSON.stringify({
                uid: req.user.uid,
                appid: req.body.appid,
                permissionList: req.body.permissionList,
                time: dayjs().valueOf(),
                exp: dayjs().add(5, 'minute').valueOf()
            })
        )

        // 写入数据库
        try {
            await AuthLog.create({
                uid: req.user.uid,
                appid: req.body.appid,
                ip: (req.headers['x-real-ip'] || req.ip).toString(),
                time: dayjs().valueOf(),
                exp: dayjs().add(5, 'minute').valueOf(),
                ua: req.headers['user-agent'],
                fingerprint: req.headers.fingerprint
            })
        } catch (error) {
            logger.error(error)
        }

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
