export interface Permission {
    pid: number
    name: string
    path: string
    allow?: boolean
    parent?: number
    desc?: string
}

export const defaultPermissions: Permission[] = [
    {
        pid: 100,
        name: 'common',
        path: 'common',
        desc: '通用顶级权限'
    },
    {
        pid: 200,
        name: 'admin',
        path: 'admin',
        desc: '管理员顶级权限'
    },
    {
        pid: 300,
        name: 'user',
        path: 'user',
        desc: '用户顶级权限'
    }
]
