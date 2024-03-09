import { Router } from 'express'
import dayjs from 'dayjs'

import { Op } from 'sequelize'

import checkValue from './../../utils/checkValue'
import { encrypt } from './../../utils/crypt'

import { AuthLog, Application } from './../../database/table'

import logger, { authLogger } from './../../utils/log'

import { auth } from '@/utils/permission'

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
        if (!checkValue(req.body?.appid, req.body?.permissionList))
            return res.send({
                status: 400,
                msg: '参数错误'
            })

        // 获取 app
        const app = await Application.findOne({
            where: {
                appid: req.body.appid,
                status: {
                    [Op.ne]: -1
                }
            }
        })

        if (!app) {
            return res.send({
                status: 404,
                msg: '应用程序不存在'
            })
        }

        // 未审核应用过滤
        if (!(await auth('admin.noreview', req.user.uid))) {
            if (app.toJSON().status === 0 && app.toJSON().owner !== req.user.uid) {
                return res.send({
                    status: 503,
                    msg: '应用未审核，仅支持应用所有者调试使用'
                })
            }
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

        if (count > 10 && app.toJSON().owner !== req.user.uid) {
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
