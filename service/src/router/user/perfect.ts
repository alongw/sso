import { Router } from 'express'
import { User } from './../../database/table.js'
import checkValue from './../../utils/checkValue.js'
import validator from 'validator'

import type { Request } from './../../types/request.js'

const router = Router()

const checkUserName = (username: string) => {
    return (
        validator.isAlphanumeric(username) &&
        validator.isLength(username, { min: 4, max: 16 })
    )
}

// 是否需要进行补充信息
router.get('/', async (req: Request, res) => {
    const result = await User.findOne({
        where: {
            uid: req.user.uid,
            username: null
        }
    })
    if (result) {
        return res.send({
            status: 200,
            msg: '需要完善信息',
            data: {
                need: true
            }
        })
    }
    return res.send({
        status: 200,
        msg: '不需要完善信息',
        data: {
            need: false
        }
    })
})

// 判断用户名是否可用
router.post(
    '/',
    async (
        req: Request<{
            username: string | undefined
        }>,
        res
    ) => {
        if (!checkValue(req?.body?.username))
            return res.send({
                status: 400,
                msg: '参数错误'
            })

        if (!checkUserName(req.body.username)) {
            return res.send({
                status: 200,
                msg: '用户名可用性获取成功',
                data: {
                    available: false
                }
            })
        }

        const result = await User.findOne({
            where: {
                username: req.body.username
            }
        })

        if (!result) {
            return res.send({
                status: 200,
                msg: '用户名可用性获取成功',
                data: {
                    available: true
                }
            })
        }

        return res.send({
            status: 200,
            msg: '用户名可用性获取成功',
            data: {
                available: false
            }
        })
    }
)

// 设置用户名
router.put('/', async (req: Request<{ username: string | undefined }>, res) => {
    if (!checkValue(req?.body?.username))
        return res.send({
            status: 400,
            msg: '参数错误'
        })

    if (!checkUserName(req.body.username)) {
        return res.send({
            status: 421,
            msg: '用户名不可用'
        })
    }

    const result0 = await User.findOne({
        where: {
            uid: req.user.uid,
            username: null
        }
    })

    if (!result0) {
        return res.send({
            status: 421,
            msg: '无法重复设置用户名'
        })
    }

    const result = await User.findOne({
        where: {
            username: req.body.username
        }
    })

    if (result) {
        return res.send({
            status: 421,
            msg: '用户名被占用'
        })
    }

    await User.update(
        {
            username: req.body.username,
            group: 1,
            status: 1
        },
        {
            where: {
                uid: req.user.uid
            }
        }
    )

    return res.send({
        status: 200,
        msg: '用户名设置成功'
    })
})

export default router
