import { Router } from 'express'
import dayjs from 'dayjs'
import { Application, AuthLog, User } from './../../database/table'
import { authLogger } from './../../utils/log'
import token from './../../utils/token'
import { decrypt } from './../../utils/crypt'

import checkValue from './../../utils/checkValue'
// import { Request } from './../../types/request'

interface CodeType {
    uid: string | undefined
    appid: string | undefined
    permissionList: number[] | undefined
    time: number | undefined
    exp: number | undefined
    authId: number | undefined
}

const router = Router()

router.post('/token', async (req, res) => {
    if (
        !checkValue(
            req.body?.grant_type,
            req.body?.code,
            req.body?.redirect_uri,
            req.body?.client_id,
            req.body?.client_secret
        )
    ) {
        return res.status(400).send({
            error: 'invalid_request',
            error_description: 'missing parameters'
        })
    }

    // 效验客户端身份 client_id、client_secret、redirect_uri
    const app = await Application.findOne({
        where: {
            appid: req.body.client_id,
            secret: req.body.client_secret,
            redirect: req.body.redirect_uri
        }
    })

    if (!app) {
        return res.status(400).send({
            error: 'invalid_client',
            error_description: 'invalid client'
        })
    }

    // 效验
    if (req.body.grant_type === 'authorization_code') {
        // 效验 code
        const decode = JSON.parse(decrypt(req.body.code)) as unknown as CodeType
        if (
            !checkValue(
                decode,
                decode.appid,
                decode.uid,
                decode.authId,
                decode.exp,
                decode.time,
                decode.permissionList
            )
        ) {
            return res.status(400).send({
                error: 'invalid_request',
                error_description: 'invalid code'
            })
        }

        // 效验 code 是否过期 / 被使用
        const authLog = await AuthLog.findOne({
            where: {
                id: decode.authId
            }
        })
        if (
            !authLog ||
            authLog.toJSON().use ||
            authLog.toJSON().exp < dayjs().valueOf()
        ) {
            return res.status(400).send({
                error: 'invalid_request',
                error_description: 'invalid code'
            })
        }

        // 效验 appid 是否一致
        if (decode.appid !== req.body.client_id) {
            return res.status(400).send({
                error: 'invalid_request',
                error_description: 'invalid appid'
            })
        }

        // 使用 code
        await AuthLog.update(
            {
                use: true
            },
            {
                where: {
                    id: decode.authId
                }
            }
        )

        // 获取用户信息
        const result = await User.findOne({
            where: {
                uid: decode.uid
            }
        })

        const user = result?.toJSON()

        authLogger.info(
            `[TOKEN] - appid ${app.get('appid')} 获得了用户 uid ${
                decode.uid
            } 的授权令牌 具体权限为 ${decode.permissionList}`
        )

        // 分发 token
        return res.send({
            access_token: token(
                {
                    uid: decode.uid,
                    username: user?.username || '',
                    email: user?.email || '',
                    status: user?.status || 0,
                    nickname: user?.nickname || '',
                    group: user?.group || 0,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    createdAt: (user as any)?.createdAt || '',
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    updatedAt: (user as any)?.updatedAt || '',
                    appid: decode.appid,
                    authId: decode.authId,
                    permissionList: decode.permissionList,
                    info: 'Nya-Account | https://alongw.cn | https://github.com/alongw/sso'
                },
                60 * 60 * 24
            ),
            token_type: 'Bearer',
            expires_in: 60 * 60 * 24,
            refresh_token: null,
            scope: decode.permissionList
        })
    }
})

export default router
