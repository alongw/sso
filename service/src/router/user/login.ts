/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express'
import { needCaptcha } from './../../hook/useUser'
import { Request } from './../../types/request'
import { checkTicket } from './../../utils/captcha'
import token from './../../utils/token'
import checkValue from './../../utils/checkValue'
import dayjs from 'dayjs'

import { useLogin } from '@/hook/useLogin'

import { UserTable } from '@/types/table'
import logger from '@/utils/log'

const router = Router()

router.post(
    '/',
    async (
        req: Request<{
            type: 'mail' | 'password' | 'authenticator' | undefined
            userinput: string | undefined
            codeinput: string | undefined
            captcha:
                | {
                      randstr: string | undefined
                      ticket: string | undefined
                  }
                | undefined
            keep: boolean | undefined
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            authn: any | undefined
        }>,
        res
    ) => {
        if (!checkValue(req?.body?.userinput, req?.body?.type)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }
        if (req.body.type !== 'authenticator') {
            if (!checkValue(req.body.codeinput)) {
                return res.send({
                    status: 400,
                    msg: '参数错误'
                })
            }
        }

        // 判断用户是否有外部验证器

        // 效验验证码
        if (
            (await needCaptcha(req.body.userinput, req.headers.fingerprint)) &&
            req.body.type !== 'authenticator'
        ) {
            if (!checkValue(req.body.captcha?.randstr, req.body.captcha?.ticket)) {
                return res.send({
                    status: 400,
                    msg: '需要验证码'
                })
            }
            // 效验验证码
            const checkResult = await checkTicket(
                req.body.captcha?.ticket,
                req.body.captcha?.randstr
            )
            if (checkResult.status !== 200) {
                return res.send({
                    status: checkResult.status,
                    msg: '验证码验证不通过：' + checkResult.msg
                })
            }
        }

        const { checkLogin } = useLogin(
            req.body.userinput,
            req.body.codeinput,
            req.headers['user-agent'],
            req.headers.fingerprint,
            (req.userIp || req.headers['x-real-ip'] || req.ip).toString(),
            req.body.captcha?.randstr ? true : false
        )

        const { email, password, authenticator } = await checkLogin()
        let result: {
            status: number
            msg: string
            user?: UserTable
        }

        if (req.body.type === 'mail') {
            result = await email()
        } else if (req.body.type === 'password') {
            result = await password()
        } else if (req.body.type === 'authenticator') {
            result = await authenticator(req.body.authn)
        } else {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        // 登录失败
        if (result.status !== 200) {
            return res.send({
                status: result.status,
                msg: result.msg
            })
        }
        logger.info(
            `用户 ${result.user.username || '未命名'}${
                result.user.nickname ? `(${result.user?.nickname})` : ''
            }（${result.user.uid}）登录系统`
        )
        // 登录成功
        return res.send({
            status: 200,
            msg: '登录成功',
            data: {
                token: token(
                    {
                        uid: result.user.uid,
                        group: result.user.group,
                        username: result.user.username || '',
                        email: result.user.email,
                        nickname: result.user.nickname || result.user.username || '',
                        status: result.user.status || 0,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        createdAt: (result as any).user.createdAt as Date,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        updatedAt: (result as any).user.updatedAt as Date,
                        info: 'Nya-Account | https://alongw.cn | https://github.com/alongw/sso'
                    },
                    req.body.keep ? 60 * 60 * 24 * 7 : 60 * 60 * 12
                ),
                expire: dayjs()
                    .add(req.body.keep ? 60 * 60 * 24 * 7 : 60 * 60 * 12, 'second')
                    .valueOf()
            }
        })
    }
)

export default router
