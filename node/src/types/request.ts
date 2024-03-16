import { Request as ExpressRequest } from 'express'
// import { ParsedQs } from 'qs'

// interface SystemHeader {
//     fingerprint: string
// }

export interface User {
    uid: string
    keyUUID: string
    username: string
    email: string
    status: number
    nickname: string
    group: number
    createdAt: Date
    updatedAt: Date
    appid: string
    authId: number
    permissionList: number[]
    avatar: string
    info: 'Nya-Account | https://alongw.cn | https://github.com/alongw/sso'
}

export interface Request<
    B = Partial<Record<string, never>>,
    Q extends ExpressRequest['query'] = Partial<Record<string, never>>,
    P extends ExpressRequest['params'] = Partial<Record<string, never>>,
    H extends ExpressRequest['headers'] = ExpressRequest['headers']
> extends ExpressRequest {
    // headers: H & SystemHeader
    headers: H
    params: P
    query: Q
    body: B
    userIp: string
    user: User
}
