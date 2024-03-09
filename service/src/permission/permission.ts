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
        path: 'common'
    },
    {
        pid: 101,
        name: 'admin',
        path: 'admin'
    },
    {
        pid: 102,
        name: 'user',
        path: 'user'
    }
]
