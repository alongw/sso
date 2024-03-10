import { Router } from 'express'

import CryptoJS from 'crypto-js'

import { Application } from './../../database/table'

import checkValue from './../../utils/checkValue'

import { checkTicket } from '../../utils/captcha'

import { Op } from 'sequelize'

import type { Request } from './../../types/request'

const router = Router()

router.use('/permission', async (req, res, next) =>
    (await import('./permission')).default(req, res, next)
)

// 获取自己的所有应用程序
router.get('/all', async (req: Request, res) => {
    const applications = await Application.findAll({
        where: {
            owner: req.user.uid,
            status: {
                [Op.or]: [0, 1]
            }
        }
    })

    const list = applications.map((e) => {
        const app = e.toJSON()
        return {
            appid: app.appid,
            name: app.name,
            description: app.description,
            status: app.status,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            createTime: (app as any)?.createdAt || 0,
            approve: app.approve
        }
    })

    res.send({
        status: 200,
        msg: '获取应用程序列表成功',
        data: {
            applicationList: list
        }
    })
})

// 获取应用程序详情
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

        const result = await Application.findOne({
            where: {
                appid: req.query.appid,
                owner: req.user.uid,
                status: {
                    [Op.or]: [0, 1]
                }
            }
        })

        if (!result) {
            return res.send({
                status: 404,
                msg: '应用程序不存在'
            })
        }

        const app = result.toJSON()

        return res.send({
            status: 200,
            msg: '获取应用程序详细信息成功',
            data: {
                appid: app.appid,
                name: app.name,
                description: app.description,
                secret: app.secret,
                status: app.status,
                owner: app.owner,
                redirect: app.redirect,
                approve: app.approve,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                createTime: (app as any)?.createdAt || 0
            }
        })
    }
)

// 刷新应用程序密钥
router.put(
    '/refreshSecret',
    async (
        req: Request<{
            appid: string
        }>,
        res
    ) => {
        if (!checkValue(req.body.appid)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        const result = await Application.findOne({
            where: {
                appid: req.body.appid,
                owner: req.user.uid,
                status: {
                    [Op.or]: [0, 1]
                }
            }
        })

        if (!result) {
            return res.send({
                status: 404,
                msg: '应用程序不存在'
            })
        }

        try {
            result.set(
                'secret',
                CryptoJS.MD5(CryptoJS.lib.WordArray.random(128)).toString()
            )
            result.save()
        } catch (error) {
            return res.send({
                status: 500,
                msg: '刷新密钥失败'
            })
        }

        return res.send({
            status: 200,
            msg: '刷新密钥成功'
        })
    }
)

// 创建应用程序
router.post(
    '/',
    async (
        req: Request<{
            name: string
            ticket: string
            randstr: string
        }>,
        res
    ) => {
        if (!checkValue(req.body.name, req.body.ticket, req.body.randstr)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        // 名字不能超过 50 个字符
        if (req.body.name.length > 50) {
            return res.send({
                status: 400,
                msg: '应用程序名称不合法'
            })
        }

        // 效验验证码
        const captchaBack = await checkTicket(req.body.ticket, req.body.randstr)
        if (captchaBack.status !== 200) {
            return res.send({
                status: 400,
                msg: captchaBack.msg
            })
        }

        try {
            Application.create({
                name: req.body.name,
                secret: CryptoJS.MD5(CryptoJS.lib.WordArray.random(128)).toString(),
                status: 0,
                owner: req.user.uid,
                redirect: '',
                approve: 0
            })
        } catch (error) {
            return res.send({
                status: 500,
                msg: '创建应用程序失败'
            })
        }

        return res.send({
            status: 200,
            msg: '创建应用程序成功'
        })
    }
)

// 删除应用程序
router.delete('/', async (req: Request<{ appid: string }>, res) => {
    if (!checkValue(req.body.appid)) {
        return res.send({
            status: 400,
            msg: '参数错误'
        })
    }

    const result = await Application.findOne({
        where: {
            appid: req.body.appid,
            owner: req.user.uid,
            status: {
                [Op.or]: [0, 1]
            }
        }
    })

    if (!result) {
        return res.send({
            status: 404,
            msg: '应用程序不存在'
        })
    }

    try {
        result.update({
            status: -1
        })
    } catch (error) {
        return res.send({
            status: 500,
            msg: '删除应用程序失败'
        })
    }

    return res.send({
        status: 200,
        msg: '删除应用程序成功'
    })
})

// 修改应用程序
router.put(
    '/',
    async (
        req: Request<{
            appid: string
            name: string
            description: string
            redirect: string
        }>,
        res
    ) => {
        if (!checkValue(req.body.appid)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        if (req.body.name && (req.body.name.length > 50 || req.body.name.length < 1)) {
            return res.send({
                status: 400,
                msg: '应用程序名称不合法'
            })
        }

        if (
            req.body.description &&
            (req.body.description.length > 100 || req.body.description.length < 1)
        ) {
            return res.send({
                status: 400,
                msg: '应用程序描述不合法'
            })
        }

        if (
            req.body.redirect &&
            (req.body.redirect.length > 100 || req.body.redirect.length < 1)
        ) {
            return res.send({
                status: 400,
                msg: '应用重定向 url 不合法'
            })
        }

        const result = await Application.findOne({
            where: {
                appid: req.body.appid,
                owner: req.user.uid,
                status: {
                    [Op.or]: [0, 1]
                }
            }
        })

        if (!result) {
            return res.send({
                status: 404,
                msg: '应用程序不存在'
            })
        }

        const app = result.toJSON()

        try {
            result.update({
                name: req.body.name || app.name,
                description: req.body.description || app.description,
                redirect: req.body.redirect || app.redirect
            })
        } catch (error) {
            return res.send({
                status: 500,
                msg: '修改应用程序失败'
            })
        }

        return res.send({
            status: 200,
            msg: '修改应用程序成功'
        })
    }
)

// 应急下架应用程序
router.post('/removeReview', async (req: Request<{ appid: string }>, res) => {
    if (!checkValue(req.body.appid)) {
        return res.send({
            status: 400,
            msg: '参数错误'
        })
    }

    const result = await Application.findOne({
        where: {
            appid: req.body.appid,
            owner: req.user.uid,
            status: 1
        }
    })

    if (!result) {
        return res.send({
            status: 404,
            msg: '应用程序不存在'
        })
    }

    try {
        result.update({
            status: 0
        })
    } catch (error) {
        return res.send({
            status: 500,
            msg: '下架应用程序失败'
        })
    }

    return res.send({
        status: 200,
        msg: '下架应用程序成功'
    })
})

export default router
