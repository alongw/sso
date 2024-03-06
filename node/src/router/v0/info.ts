import { Router } from 'express'

import type { Request } from './../../types/request'

const router = Router()

router.get('/', async (req: Request, res) => {
    if (req.user.permissionList?.indexOf(1) === -1) {
        return res.status(403).send({
            status: 403,
            msg: '没有权限'
        })
    }
    res.send({
        status: 200,
        msg: '获取用户基础信息成功',
        data: {
            uid: req.user.uid,
            nickname: req.user.nickname,
            status: req.user.status,
            avatar: req.user.avatar
        }
    })
})

export default router
