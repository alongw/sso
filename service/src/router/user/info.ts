import { Router } from 'express'
import dayjs from 'dayjs'

import { getAvatar } from './../../hook/useUser'
import { User } from './../../database/table'

import { Request } from './../../types/request'

const router = Router()

router.get('/', async (req: Request, res) => {
    const result = await User.findOne({
        where: {
            uid: req.user.uid
        }
    })

    const avatar = await getAvatar(req.user.uid)

    return res.send({
        status: 200,
        msg: '用户信息获取成功',
        data: {
            uid: result?.get('uid'),
            username: result?.get('username'),
            email: result?.get('email'),
            avatar: avatar,
            status: result?.get('status'),
            nickname: result?.get('nickname'),
            group: result?.get('group'),
            createTime: dayjs(result?.get('createdAt').toString()).format(
                'YYYY-MM-DD HH:mm:ss'
            ),
            password: result?.get('password') === null ? false : true
        }
    })
})

export default router
