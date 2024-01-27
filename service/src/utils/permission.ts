/* eslint-disable @typescript-eslint/no-unused-vars */
import { GroupPermission, Permission, User } from './../database/table'

import {
    defaultPermissions,
    type Permission as DataPermission
} from './../data/permission'

enum StatusCode {
    Forbidden = 403,
    OK = 200,
    InternalServerError = 500
}

const DEFAULT_PERMISSION_SEPARATOR = ':'

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

const hasPermission = async (pidList: number[], groupID: string): Promise<boolean> => {
    for (const e of pidList) {
        // 查找权限 如果查到 ture 直接返回，如果查到了 false 也直接返回，找不到不管
        const resolve = await GroupPermission.findOne({
            where: {
                gid: groupID,
                pid: e
            }
        })
        if (resolve?.toJSON().allow === true) return true
        if (resolve?.toJSON().allow === false) return false
    }
    // 如果没有查到权限，匹配默认权限

    // TODO: 匹配默认权限
    // for (const element of defaultPermissions) {
    // }

    // 如果没有匹配到默认权限，返回 false
    return false
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
            solution: '请联系笨蛋技术人员修改后端源代码'
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
            solution: '请联系笨蛋技术人员修改后端源代码'
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
                    solution: '请联系笨蛋技术人员修改后端源代码'
                }
            pidList.unshift(pid as number)
        }
    }
    // 鉴权
    const resolve = await hasPermission(pidList, groupID.toString())
    if (resolve)
        return {
            result: true,
            title: '鉴权通过',
            code: StatusCode.OK,
            queue: pidList
        }

    return {
        result: false,
        title: '鉴权失败',
        code: StatusCode.Forbidden,
        solution: '如有疑问，请联系支持人员',
        queue: pidList
    }
}

export const usePermission = async (uuid: string) => {
    const group = await getUserGroupByUid(uuid)
    const auth = async (permissionNode: string): Promise<Resolve> => {
        return await checkPermission(permissionNode, group)
    }

    return {
        auth
    }
}

export const auth = async (permissionNode: string, uuid: string): Promise<Resolve> => {
    const group = await getUserGroupByUid(uuid)
    return await checkPermission(permissionNode, group)
}

console.log(
    await auth(
        'admin:useradmin:editUserInfo:avatar',
        'fe7e445e-b762-4b93-8ed3-6cb5c451cc1a'
    )
)
