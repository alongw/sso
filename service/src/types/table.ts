export interface SystemTable {
    id: number
    key: string
    value: string
}

export interface ConfigTable {
    id: number
    key: string
    value: string
}

export interface UserTable {
    uid: string
    username: string
    password: string
    email: string
    status: number
    nickname: string
    group: number
}

export interface GroupTable {
    gid: number
    name: string
}

export interface PermissionTable {
    pid: number
    name: string
    description: string
    parent: number
}

export interface GroupPermissionTable {
    gpid: number
    gid: number
    pid: number
    specialValue: number
    allow: boolean
}

export interface ApplicationTable {
    appid: string
    name: string
    description: string
    secret: string
    status: number
    owner: string
    redirect: string
    approve: number
}