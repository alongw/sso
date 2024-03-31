import type {
    // AuthenticatorTransportFuture,
    CredentialDeviceType
} from '@simplewebauthn/types'

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
    used: boolean
    useTime: number
    type: string
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

export interface AuthenticatorTable {
    id: number // 身份验证器的唯一标识符
    // SQL: Encode to base64url then store as `TEXT`. Index this column
    credentialID: string // 凭据的唯一标识符 Uint8Array
    // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
    credentialPublicKey: string // 公钥字节，用于后续身份验证签名验证 Uint8Array
    // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
    counter: number // 到目前为止，身份验证器在本网站上被使用的次数
    // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
    // Ex: 'singleDevice' | 'multiDevice'
    credentialDeviceType: CredentialDeviceType // 身份验证器的类型
    // SQL: `BOOL` or whatever similar type is supported
    credentialBackedUp: boolean // 身份验证器是否已备份
    // SQL: `VARCHAR(255)` and store string array as a CSV string
    // Ex: ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']
    // transports?: AuthenticatorTransportFuture[] // 身份验证器的传输方式
    transports?: string // 身份验证器的传输方式
    owner: string // 身份验证器的所有者
    name: string // 身份验证器的名称
}

export interface AuthenticatorOptionsTable {
    id: number
    uid: string
    type: 'set' | 'use'
    options: string
    update_time: number
    used: boolean
}
