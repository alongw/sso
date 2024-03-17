/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs'

import { GroupPermission, Permission, User } from '@/database/table'
import { authLogger, authLoggerOnlyFile } from './log'

import {
    defaultPermissions,
    type Permission as PermissionType,
    PermissionNode
} from '@/permission/permission'

enum StatusCode {
    Forbidden = 403,
    OK = 200,
    InternalServerError = 500
}

const permissionCache: Map<
    string,
    {
        allow: boolean
        group: number
        id: number
        exp: number
        msg: string
    }
> = new Map()

const DEFAULT_PERMISSION_SEPARATOR = '.'

interface PermissionTable {
    pid: number
    name: string
    description: string
    parent: number
}

interface Resolve {
    result: boolean
    code: StatusCode
    title: string
    msg?: string
    plance?: string
    solution?: string
    queue?: number[]
    info?: {
        result: boolean
        msg: string
        id: number
    }
}

// 权限分隔符
let permissionSeparator = DEFAULT_PERMISSION_SEPARATOR

export const setDefaultSeparator = (separator: string) => {
    permissionSeparator = separator
}

const getUserGroupByUid = async (uuid: string): Promise<number> => {
    const resolve = await User.findOne({
        where: {
            uid: uuid
        }
    })
    return resolve.toJSON().group
}

const getPermissionByPermissionName = async (
    permissionName: string,
    parent?: string | false
): Promise<number | PermissionTable[] | false> => {
    const getAllResolve = await Permission.findAll({
        where: {
            name: permissionName
        }
    })
    const getAll = getAllResolve.map((e) => e.toJSON())
    if (getAll.length === 0) return false
    // 如果是顶级权限 顶级权限不可能有重复的
    if (parent === false) return getAll[0].pid
    // 如果不是顶级权限
    if (!parent) return getAll
    const getAllParent = (await getPermissionByPermissionName(
        parent
    )) as PermissionTable[]
    for (const e of getAll) {
        const parentElement = getAllParent.find((element) => element.pid === e.parent)
        if (parentElement) return e.pid
    }
    return null
}

const hasPermission = async (
    pidList: number[],
    groupID: string
): Promise<{
    result: boolean
    msg: string
    id: number
}> => {
    for (const e of pidList) {
        // 查找权限 如果查到 ture 直接返回，如果查到了 false 也直接返回，找不到不管
        const resolve = await GroupPermission.findOne({
            where: {
                gid: groupID,
                pid: e
            }
        })
        if (resolve?.toJSON().allow === true)
            return { result: true, msg: '数据库放行', id: e }
        if (resolve?.toJSON().allow === false)
            return { result: false, msg: '数据库拦截', id: e }
    }
    // 如果没有查到权限，匹配默认权限

    for (const e of pidList) {
        const resolve = defaultPermissions.find(
            (element) => element.pid === e
        ) as PermissionType
        if (resolve.allow === true) return { result: true, msg: '默认放行', id: e }
        if (resolve.allow === false) return { result: false, msg: '默认拦截', id: e }
    }

    // 如果没有匹配到默认权限，返回 false
    return { result: false, msg: '权限未被任何场景定义', id: -1 }
}

const checkPermission = async (
    permissionNode: string,
    groupID: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    specialValue: number = 0
): Promise<Resolve> => {
    if (permissionNode.length === 0)
        return {
            result: false,
            title: '源代码错误',
            code: StatusCode.InternalServerError,
            msg: '权限节点为空',
            solution: '请联系笨蛋技术人员'
        }
    // 分隔权限列表
    const permissionNodeList = permissionNode.split(permissionSeparator)
    // 如果只有一个权限，则为顶级权限
    if (permissionNodeList.length === 1) {
        const topResolve = (await getPermissionByPermissionName(
            permissionNodeList[0]
        )) as boolean
        if (topResolve === true) {
            return {
                result: true,
                title: '鉴权通过',
                code: StatusCode.OK
            }
        }
        return {
            result: false,
            title: '鉴权失败',
            code: StatusCode.Forbidden,
            solution: '如有疑问，请联系支持人员'
        }
    }
    // 其他权限
    const pidList: number[] = []
    // 查找权限，从最高权限开始查找
    const topPermission = (await getPermissionByPermissionName(
        permissionNodeList[0],
        false
    )) as number
    // 无法匹配顶级权限
    if (!topPermission)
        return {
            result: false,
            title: '鉴权失败',
            code: 500,
            msg: '鉴权失败，节点不存在',
            plance: '顶级权限鉴权',
            solution: '请联系笨蛋技术人员'
        }
    pidList.unshift(topPermission)
    // 查找剩余权限 pid
    for (const [i, e] of permissionNodeList.entries()) {
        if (i > 0) {
            const pid = await getPermissionByPermissionName(e, permissionNodeList[i - 1])
            if (!pid)
                return {
                    result: false,
                    title: '鉴权失败',
                    code: StatusCode.InternalServerError,
                    msg: '鉴权失败，节点不存在',
                    plance: '子级权限鉴权',
                    solution: '请联系笨蛋技术人员'
                }
            pidList.unshift(pid as number)
        }
    }
    // 鉴权
    const resolve = await hasPermission(pidList, groupID.toString())
    if (resolve.result === true)
        return {
            result: true,
            title: '鉴权通过',
            code: StatusCode.OK,
            queue: pidList,
            info: resolve
        }

    return {
        result: false,
        title: '鉴权失败',
        code: StatusCode.Forbidden,
        solution: '如有疑问，请联系支持人员',
        queue: pidList,
        info: resolve
    }
}

const log = (uuid: string, result: Resolve, group: number) => {
    authLogger.info(
        `[NYA-PERMISSION] 鉴权 - 用户 uuid ${uuid} (${group}用户组) 鉴权 ${JSON.stringify(
            result.queue
        )} 队列 ${result.info?.result ? '通过' : '被拒绝'},原因:${
            result.info?.msg
        },具体出现在 ${result.info?.id}(${result.plance})`
    )
    authLoggerOnlyFile.info({
        ...result,
        uuid,
        group
    })
}

export const usePermission = async (uuid: string) => {
    const group = await getUserGroupByUid(uuid)
    const auth = async (permissionNode: string): Promise<boolean> => {
        const result = await checkPermission(permissionNode, group)
        log(uuid, result, group)
        return result.result
    }

    return {
        auth
    }
}

export const auth = async (
    permissionNode: PermissionNode,
    uuid: string
): Promise<boolean> => {
    // 检查缓存
    if (permissionCache.has(`${uuid}-${permissionNode}`)) {
        const cache = permissionCache.get(`${uuid}-${permissionNode}`)
        if (cache?.exp > dayjs().valueOf()) {
            log(
                uuid,
                {
                    result: cache.allow,
                    title: '缓存命中',
                    code: StatusCode.OK,
                    info: {
                        result: cache.allow,
                        msg: '缓存命中',
                        id: cache.id
                    },
                    plance: cache.msg
                },
                cache.group
            )

            return cache.allow
        } else {
            permissionCache.delete(`${uuid}-${permissionNode}`)
        }
    }
    // 检查权限
    const group = await getUserGroupByUid(uuid)
    const result = await checkPermission(permissionNode, group)
    permissionCache.set(`${uuid}-${permissionNode}`, {
        allow: result.result,
        group,
        id: result.info?.id || -500,
        exp: dayjs().add(1, 'hour').valueOf(),
        msg: `${result.info?.msg || '未知'} ${JSON.stringify(permissionNode)}`
    })
    log(uuid, result, group)
    return result.result
}

// console.log(
//     await auth(
//         'admin:useradmin:editUserInfo:avatar',
//         'fe7e445e-b762-4b93-8ed3-6cb5c451cc1a'
//     )
// )
