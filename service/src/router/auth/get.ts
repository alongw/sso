import { Router } from 'express'

import checkValue from './../../utils/checkValue.js'

import { Application, ApplicationPermission } from './../../database/table.js'

import type { Request } from './../../types/request.js'

const router = Router()

// 获取应用实例是否有效、需要的权限等信息
router.post(
    '/',
    async (
        req: Request<{
            appid: string | undefined
        }>,
        res
    ) => {
        if (!checkValue(req.body && req.body.appid))
            return res.send({
                status: 400,
                msg: '参数错误'
            })

        // 获取 app 信息
        const app = await Application.findOne({
            where: {
                appid: req.body.appid
            },
            include: [
                {
                    model: ApplicationPermission,
                    as: 'permissionList'
                }
            ]
        })

        if (!app)
            return res.send({
                status: 404,
                msg: '应用不存在'
            })

        // app 的状态不能是 0
        if (app.toJSON().status === 0)
            return res.send({
                status: 503,
                message: '应用未审核'
            })

        // 将 app 的 permissionList 按照 priority 从大到小排序
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const permissionList = (app.toJSON() as any).permissionList.sort(
            (a: { priority: number }, b: { priority: number }) => b.priority - a.priority
        )

        return res.send({
            status: 200,
            msg: '获取应用程序信息成功',
            data: {
                appid: app.toJSON().appid,
                name: app.toJSON().name,
                description: app.toJSON().description,
                approve: app.toJSON().approve,
                permissionList: permissionList.map(
                    (e: {
                        name: string
                        apppid: number
                        defaultCheck: boolean
                        lock: boolean
                        priority: number
                    }) => {
                        return {
                            name: e.name,
                            apppid: e.apppid,
                            defaultCheck: e.defaultCheck,
                            lock: e.lock,
                            priority: e.priority
                        }
                    }
                ),
                user: {
                    email: req.user.email
                },
                redirect: app.toJSON().redirect
            }
        })
    }
)

export default router
