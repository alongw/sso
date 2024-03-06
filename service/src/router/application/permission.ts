import { Router } from 'express'
import { Op } from 'sequelize'
const router = Router()

import checkValue from './../../utils/checkValue'

import {
    Application,
    ApplicationPermission,
    ApplicationUserPermission
} from './../../database/table'

import { Request } from './../../types/request'

export default router

// 获取所有可用权限

router.get(
    '/',
    async (
        req: Request<
            object,
            {
                appid: string
            }
        >,
        res
    ) => {
        if (!checkValue(req.query.appid)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        try {
            const appResoult = await Application.findOne({
                where: {
                    appid: req.query.appid,
                    owner: req.user.uid,
                    status: {
                        [Op.or]: [0, 1]
                    }
                }
            })

            if (!appResoult) {
                return res.send({
                    status: 404,
                    msg: '应用程序不存在'
                })
            }

            const approve = appResoult.toJSON().approve

            // 获取所有权限
            const permissionListResoult = await ApplicationPermission.findAll({
                where: {
                    typeRequire: {
                        [Op.lte]: approve || 0
                    }
                }
            })
            const permissionList = permissionListResoult.map((e) => e.toJSON())

            // 获取正在使用的所有权限
            const usePermissionResoult = await ApplicationUserPermission.findAll({
                where: {
                    appid: req.query.appid
                }
            })
            const usePermission = usePermissionResoult.map((e) => e.toJSON())

            // 获取正在使用的权限的id
            const usePermissionId = usePermission.map((e) => e.apppid)

            // 过滤出未被使用的权限
            const result = permissionList.filter((e) => {
                return !usePermissionId.includes(e.apppid)
            })

            return res.send({
                status: 200,
                msg: '获取可用权限成功',
                data: {
                    permissionList: result.map((e) => {
                        return {
                            apppid: e.apppid,
                            name: e.name,
                            description: e.description,
                            typeRequire: e.typeRequire,
                            priority: e.priority
                        }
                    })
                }
            })
        } catch (error) {
            return res.send({
                status: 500,
                msg: '获取可用权限失败'
            })
        }
    }
)

// 添加权限
router.post(
    '/',
    async (
        req: Request<{
            appid: string
            apppid: number[]
        }>,
        res
    ) => {
        if (!checkValue(req.body.appid, req.body.apppid)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        try {
            const appResoult = await Application.findOne({
                where: {
                    appid: req.body.appid,
                    owner: req.user.uid,
                    status: {
                        [Op.or]: [0, 1]
                    }
                }
            })

            if (!appResoult) {
                return res.send({
                    status: 404,
                    msg: '应用程序不存在'
                })
            }

            const permissionResult = await ApplicationPermission.findOne({
                where: {
                    apppid: req.body.apppid,
                    typeRequire: {
                        [Op.lte]: appResoult.toJSON().approve || 0
                    }
                }
            })

            if (!permissionResult) {
                return res.send({
                    status: 404,
                    msg: '权限不存在'
                })
            }
        } catch (error) {
            return res.send({
                status: 500,
                msg: '添加权限失败'
            })
        }

        try {
            for (const apppid of req.body.apppid) {
                await ApplicationUserPermission.findOrCreate({
                    where: {
                        appid: req.body.appid,
                        apppid
                    },
                    defaults: {
                        appid: req.body.appid,
                        apppid
                    }
                })
            }
        } catch (error) {
            return res.send({
                status: 500,
                msg: '添加权限失败'
            })
        }

        return res.send({
            status: 200,
            msg: '添加权限成功'
        })
    }
)

// 获取使用中的权限
router.get(
    '/using',
    async (
        req: Request<
            object,
            {
                appid: string
            }
        >,
        res
    ) => {
        if (!checkValue(req.query.appid)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        const appResoult = await Application.findOne({
            where: {
                appid: req.query.appid,
                owner: req.user.uid,
                status: {
                    [Op.or]: [0, 1]
                }
            }
        })

        if (!appResoult) {
            return res.send({
                status: 404,
                msg: '应用程序不存在'
            })
        }

        const usePermissionResoult = await ApplicationUserPermission.findAll({
            where: {
                appid: req.query.appid
            }
        })
        const usePermission = usePermissionResoult.map((e) => e.toJSON())

        // 获取相关权限的信息
        const permissionListResoult = await ApplicationPermission.findAll({
            where: {
                apppid: usePermission.map((e) => e.apppid)
            }
        })

        if (!permissionListResoult) {
            return res.send({
                status: 500,
                msg: '获取使用中的权限失败'
            })
        }

        const usePermissionList = permissionListResoult.map((e) => e.toJSON())
        res.send({
            status: 200,
            msg: '获取使用中的权限成功',
            data: {
                usePermissionList: usePermissionList.map((e) => {
                    return {
                        apppid: e.apppid,
                        name: e.name,
                        description: e.description,
                        typeRequire: e.typeRequire,
                        priority: e.priority
                    }
                })
            }
        })
    }
)

// 删除权限
router.delete(
    '/',
    async (
        req: Request<{
            appid: string
            apppid: number[]
        }>,
        res
    ) => {
        if (!checkValue(req.body.appid, req.body.apppid)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        try {
            const appResoult = await Application.findOne({
                where: {
                    appid: req.body.appid,
                    owner: req.user.uid,
                    status: {
                        [Op.or]: [0, 1]
                    }
                }
            })

            if (!appResoult) {
                return res.send({
                    status: 404,
                    msg: '应用程序不存在'
                })
            }

            await ApplicationUserPermission.destroy({
                where: {
                    apppid: {
                        [Op.in]: req.body.apppid
                    },
                    appid: req.body.appid
                }
            })
        } catch (error) {
            return res.send({
                status: 500,
                msg: '删除权限失败'
            })
        }

        return res.send({
            status: 200,
            msg: '删除权限成功'
        })
    }
)
