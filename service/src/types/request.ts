import { Request as ExpressRequest } from 'express'
// import { ParsedQs } from 'qs'

import type { USER_UID_TYPE } from '@/types'

interface SystemHeader {
    fingerprint: string
}

export interface User {
    uid: USER_UID_TYPE
    username: string
    email: string
    status: number
    nickname: string
    group: number
    createdAt: Date
    updatedAt: Date
    info: 'Nya-Account | https://alongw.cn | https://github.com/alongw/sso'
}

export interface Request<
    B = Partial<Record<string, never>>,
    Q extends ExpressRequest['query'] = Partial<Record<string, never>>,
    P extends ExpressRequest['params'] = Partial<Record<string, never>>,
    H extends ExpressRequest['headers'] = ExpressRequest['headers']
> extends ExpressRequest {
    headers: H & SystemHeader
    params: P
    query: Q
    body: B
    userIp: string
    user: User
}
