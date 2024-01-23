import { Request as ExpressRequest } from 'express'

export interface User {
    uid: number
}

export interface Request extends ExpressRequest {
    userIp: string
    user: User
}
