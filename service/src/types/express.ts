import { Request as ExpressRequest } from 'express'

export interface User {
    uid: string
    username: string
    email: string
    status: number
    nickname: string
    group: number
    createdAt: Date
    updatedAt: Date
    info: 'Nya-Account | https://alongw.cn | https://github.com/alongw/sso'
}

export interface Request extends ExpressRequest {
    userIp: string
    user: User
}
