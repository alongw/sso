import { Router } from 'express'

import type { Request } from '@/types/request'

const router = Router()

// 获取邮箱地址
router.get('/', async (req: Request, res) => {
    // 需要权限 2
    if (req.user.permissionList?.indexOf(2) === -1) {
        return res.status(403).send({
            status: 403,
            msg: '没有权限'
        })
    }
    res.send({
        status: 200,
        msg: '获取邮箱地址成功',
        data: {
            email: req.user.email
        }
    })
})

export default router
