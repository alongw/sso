import { Router } from 'express'

import type { Request } from './../../types/request'

const router = Router()

router.get('/', async (req: Request, res) => {
    if (req.user.permissionList?.indexOf(3) === -1) {
        return res.status(403).send({
            status: 403,
            msg: '没有权限'
        })
    }
    res.send({
        status: 200,
        msg: '获取用户真实信息成功',
        data: {
            uid: req.user.uid,
            username: req.user.username,
            real_id: req.user.keyUUID,
            status: req.user.status,
            avatar: req.user.avatar
        }
    })
})

export default router
