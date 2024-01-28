import { Request as ExpressRequest } from 'express'
// import { ParsedQs } from 'qs'

export interface Request<
    B = Record<string, never>,
    Q extends ExpressRequest['query'] = Record<string, never>,
    P extends ExpressRequest['params'] = Record<string, never>
> extends ExpressRequest {
    params: P
    query: Q
    body: B
}
