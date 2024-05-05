import { Router } from 'express'

import { useLoginLogs, useAuthLogs } from '@/hook/useLogs'

import { Request } from '@/types/request'

const router = Router()

// 获取用户登录日志
router.post(
    '/login',
    async (
        req: Request<{
            max_number?: number
        }>,
        res
    ) => {
        const { getLogs } = useLoginLogs(req.user.uid)

        // 默认获取 10 条记录
        const max_number = req.body.max_number || 10

        const { data, msg, status } = await getLogs(max_number)

        return res.send({
            status: status ? 200 : 500,
            msg,
            data
        })
    }
)

// 获取用户授权日志
router.post(
    '/auth',
    async (
        req: Request<{
            max_number?: number
        }>,
        res
    ) => {
        const { getLogs } = useAuthLogs(req.user.uid)

        // 默认获取 10 条记录
        const max_number = req.body.max_number || 10

        const { data, msg, status } = await getLogs(max_number)

        return res.send({
            status: status ? 200 : 500,
            msg,
            data
        })
    }
)

export default router
