import { Router } from 'express'

import CryptoJS from 'crypto-js'

import { Application } from './../../database/table.js'

import checkValue from './../../utils/checkValue.js'

import { checkTicket } from '../../utils/captcha.js'

import type { Request } from './../../types/request.js'

const router = Router()

router.use('/permission', async (req, res, next) =>
    (await import('./permission.js')).default(req, res, next)
)

// 获取自己的所有应用程序
router.get('/', async (req: Request, res) => {
    const applications = await Application.findAll({
        where: {
            owner: req.user.uid
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
            createTime: (app as any)?.createAt || 0,
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
        if (!checkValue(req.params.appid)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        const result = await Application.findOne({
            where: {
                appid: req.params.appid,
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
                createTime: (app as any)?.createAt || 0
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
        result.set('status', -1)
        result.save()
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

export default router
