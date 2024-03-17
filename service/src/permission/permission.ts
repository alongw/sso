export interface Permission {
    pid: number
    name: string
    path: string
    allow?: boolean
    parent?: number
    desc?: string
}

export type PermissionNode = (typeof defaultPermissions)[number]['path']

export const defaultPermissions = [
    // common
    {
        pid: 10,
        name: 'common',
        path: 'common',
        desc: '通用顶级权限'
    },
    {
        pid: 1010,
        name: 'auth',
        path: 'common.auth',
        parent: 10,
        desc: '鉴权一般应用',
        allow: true
    },
    // admin
    {
        pid: 20,
        name: 'admin',
        path: 'admin',
        desc: '管理员顶级权限'
    },
    {
        pid: 2010,
        name: 'noreview',
        path: 'admin.noreview',
        parent: 20,
        desc: '鉴权未经审核的应用',
        allow: false
    },
    // user
    {
        pid: 30,
        name: 'user',
        path: 'user',
        desc: '用户顶级权限'
    }
] as const
