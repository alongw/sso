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
    public_email: string
    status: number
    nickname: string
    group: number
}

export interface EmailCodeTable {
    id: number
    code: string
    email: string
    ip: string
    expire: number
    sendTime: number
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

export interface ApplicationPermissionTable {
    apppid: number
    name: string
    description: string
    typeRequire: number
    defaultCheck: boolean
    lock: boolean
    priority: number
}

export interface ApplicationUserPermissionTable {
    aupid: number
    appid: string
    apppid: number
}

export interface LoginLogTable {
    id: number
    uid: string
    ip: string
    time: number
    type: string
    captcha: boolean
    ua: string
    fingerprint: string
}

export interface AuthLogTable {
    id: number
    uid: string
    appid: string
    ip: string
    time: number
    exp: number
    ua: string
    fingerprint: string
    use: boolean
}
