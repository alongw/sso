export interface Permission {
    pid: number
    name: string
    path: string
    allow?: boolean
    parent?: number
}

export const defaultPermissions: Permission[] = [
    {
        pid: 1,
        name: 'admin',
        path: 'admin'
    },
    {
        pid: 2,
        name: 'useradmin',
        path: 'admin.useradmin',
        parent: 1,
        allow: false
    },
    {
        pid: 3,
        name: 'editUserInfo',
        path: 'admin.useradmin.editUserInfo',
        parent: 2
    },
    {
        pid: 4,
        name: 'avatar',
        path: 'admin.useradmin.editUserInfo.avatar',
        parent: 3,
        allow: false
    }
]
