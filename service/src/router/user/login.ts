/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express'
import { Op, Sequelize } from 'sequelize'
import { needCaptcha } from './../../hook/useUser'
import { isMail } from './../../utils/mail'
import { Request } from './../../types/request'
import { checkTicket } from './../../utils/captcha'
import token from './../../utils/token'
import { User, EmailCode } from './../../database/table'
import checkValue from './../../utils/checkValue'
import dayjs from 'dayjs'
import CryptoJS from 'crypto-js'

const router = Router()

router.post(
    '/',
    async (
        req: Request<{
            type: 'mail' | 'password' | undefined
            userinput: string | undefined
            codeinput: string | undefined
            captcha:
                | {
                      randstr: string | undefined
                      ticket: string | undefined
                  }
                | undefined
            keep: boolean | undefined
        }>,
        res
    ) => {
        if (!checkValue(req.body, req.body.userinput, req.body.codeinput)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        // 效验验证码
        if (await needCaptcha(req.body.userinput, req.headers.fingerprint)) {
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

        // 判断是不是邮箱
        const loginType = isMail(req.body.userinput) ? 'email' : 'username'

        // 判断账号是否存在
        const result = await User.findOne({
            where: {
                [loginType]: req.body.userinput
            }
        })

        if (!result) {
            return res.send({
                status: 403,
                msg: '登录失败，请重试'
            })
        }

        if (req.body.type === 'mail') {
            // 判断验证码是否正确
            const emailCode = await EmailCode.findOne({
                where: {
                    email: result.get('email'),
                    code: req.body.codeinput,
                    expire: {
                        [Op.gte]: Sequelize.fn('UNIX_TIMESTAMP', Sequelize.col('expire'))
                    }
                }
            })
            if (!emailCode) {
                return res.send({
                    status: 403,
                    msg: '登录失败，请重试'
                })
            }
            if (emailCode.get('code') === req.body.codeinput) {
                return res.send({
                    status: 200,
                    msg: '登录成功',
                    data: {
                        token: token(
                            {
                                uid: result.get('uid') as string,
                                group: result.get('group') as number,
                                username: (result.get('username') as string) || '',
                                email: result.get('email') as string,
                                nickname:
                                    (result.get('nickname') as string) ||
                                    (result.get('username') as string) ||
                                    '',
                                status: (result.get('status') as number) || 0,
                                createdAt: result.get('createdAt') as Date,
                                updatedAt: result.get('updatedAt') as Date,
                                info: 'Nya-Account | https://alongw.cn | https://github.com/alongw/sso'
                            },
                            req.body.keep ? 60 * 60 * 24 * 7 : 60 * 60 * 12
                        ),
                        expire: dayjs()
                            .add(
                                req.body.keep ? 60 * 60 * 24 * 7 : 60 * 60 * 12,
                                'second'
                            )
                            .valueOf()
                    }
                })
            }
        }

        if (req.body.type === 'password') {
            // 判断密码是否正确
            const user = await User.findOne({
                where: {
                    [loginType]: req.body.userinput,
                    password: CryptoJS.MD5(req.body.codeinput).toString()
                }
            })
            if (!user) {
                return res.send({
                    status: 403,
                    msg: '登录失败，请重试'
                })
            }
            return res.send({
                status: 200,
                msg: '登录成功',
                data: {
                    token: token(
                        {
                            uid: result.get('uid') as string,
                            group: result.get('group') as number,
                            username: (result.get('username') as string) || '',
                            email: result.get('email') as string,
                            nickname:
                                (result.get('nickname') as string) ||
                                (result.get('username') as string) ||
                                '',
                            status: (result.get('status') as number) || 0,
                            createdAt: result.get('createdAt') as Date,
                            updatedAt: result.get('updatedAt') as Date,
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
    }
)

export default router
