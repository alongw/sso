import type { Permission } from '../types/permission.js'
import type { Request } from '../types/express.js'
import type { RequestHandler } from 'express'
import logger from './log.js'
import { query } from './db.js'

import { defaultPermission } from './../data/permission.js'

/**
 * 将两级的类型转换为可选
 */
type PartialSub<T> = {
    [k in keyof T]?: {
        [sub in keyof T[k]]?: T[k][sub]
    }
}

/**
 * 判断单个或多个权限
 */

export const checkPermission = async (
    permission: PartialSub<Permission> | string,
    user: number
): Promise<boolean> => {
    // 单个权限
    if (typeof permission == 'string') {
        const havePermission = await checkUserPermission(user, permission)
        if (!havePermission) {
            return false
        }
        return true
    }
    // 多个权限
    for (const i in permission) {
        for (const j in permission[i as keyof typeof permission]) {
            const name = `${i}.${j}`
            const havePermission = await checkUserPermission(user, name)
            if (!havePermission) {
                return false
            }
        }
    }
    return true
}

/**
 * express中间件
 * 验证权限
 */
export const auth: {
    (permission: PartialSub<Permission>): RequestHandler
    <T extends keyof Permission>(permission: T, key: keyof Permission[T]): RequestHandler
} = (permission: PartialSub<Permission> | string, key?: string): RequestHandler => {
    return async (req: Request, res, next) => {
        const user = req.user
        let havePermission = false
        if (typeof permission == 'string') {
            havePermission = await checkPermission(`${permission}.${key}`, user.uid)
        } else {
            havePermission = await checkPermission(permission, user.uid)
        }
        if (!havePermission) {
            logger.info(
                `鉴权 - 由于用户 UID ${req.user.uid} 访问 ${
                    req.path
                } 接口鉴权 ${JSON.stringify(
                    permission
                )} 所有鉴权均不通过，因此返回 1020 鉴权失败错误码`
            )
            return res.send({
                status: 1020,
                msg: '鉴权失败，您无权执行该操作。详细请咨询管理员'
            })
        }
        logger.info(
            `鉴权 - 由于用户 UID ${req.user.uid} 访问 ${
                req.path
            } 接口鉴权 ${JSON.stringify(permission)} 部分鉴权通过，因此放行本次请求`
        )
        next()
    }
}

/**
 * 验证用户权限
 */
const checkUserPermission = async (user: number, name: string) => {
    const [err, result] = await query<
        {
            value: boolean | null | 0 | 1
        }[]
    >`
  select * from user
  left join permission on 
      permission_group = permission.group and
      permission.name=${name}
  where user.uid=${user}
  `
    if (err || result[0]?.value == 0) {
        logger.info(`鉴权 - 用户 UID ${user} 鉴权 ${name} 拒绝`)
        return false
    }
    // 数据库没有约定权限
    const nameKey = name.split('.')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (result[0]?.value == null && !defaultPermission[nameKey[0]]?.[nameKey[1]]) {
        logger.info(
            `鉴权 - 用户 UID ${user} 鉴权 ${name} 找不到相关权限节点，因此匹配默认权限返回拒绝`
        )
        return false
    }
    logger.info(`鉴权 - 用户 UID ${user} 鉴权 ${name} 通过`)
    return true
}
