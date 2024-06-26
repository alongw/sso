import { Router } from 'express'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import dayjs from 'dayjs'
import checkValue from './../../utils/checkValue'
import logger from './../../utils/log'
import { checkTicket } from './../../utils/captcha'
import { sendMail, getMailTemplate, isMail, hideMail } from './../../utils/mail'
import { useMailCode } from '@/hook/useMailCode'
import {
    User,
    EmailCode,
    Authenticator,
    AuthenticatorOptions
} from './../../database/table'
import { Request } from '../../types/request'
import { needCaptcha, recentLogin, getAvatar } from './../../hook/useUser'

import { base64ToUint8Array } from '@/utils/covertUint8Array'

import { getWebAuthnRpId } from '@/utils/system'

import type { UserTable, AuthenticatorTable } from '@/types/table'

const router = Router()

const { sendEmailCode } = useMailCode()

router.post(
    '/getAccountStatus',
    async (
        req: Request<{
            email: string | undefined
            captcha:
                | {
                      randstr: string | undefined
                      ticket: string | undefined
                  }
                | undefined
            notUseAuthn: boolean | undefined
        }>,
        res
    ) => {
        if (!checkValue(req?.body?.email)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        // 判断是不是邮箱
        const type = isMail(req.body.email) ? 'email' : 'username'

        if (type === 'email') {
            // 获取用户是否注册
            const result = await User.findOne({
                where: {
                    email: req.body.email
                }
            })

            if (!result) {
                // 未注册 提示用户经过滑动验证码挑战
                if (
                    !checkValue(req?.body?.captcha?.randstr, req?.body?.captcha?.ticket)
                ) {
                    return res.send({
                        status: 422,
                        msg: '需要验证码',
                        data: {
                            captcha: true
                        }
                    })
                }

                // 验证验证码
                const checkResult = await checkTicket(
                    req.body.captcha.ticket,
                    req.body.captcha.randstr
                )
                if (checkResult.status !== 200) {
                    return res.send({
                        status: checkResult.status,
                        msg: '验证码验证不通过：' + checkResult.msg
                    })
                }

                // 用户已经经过了验证码挑战 准备发送邮件
                const result2 = await EmailCode.findAll({
                    where: {
                        email: req.body.email
                    }
                })

                // 频繁发送邮件检测
                if (result2.length > 0) {
                    // 找到最近的一条记录，如果时间间隔小于 60s 则不发送
                    const last = result2[result2.length - 1]
                    const lastTime = dayjs(last.toJSON().sendTime).valueOf()
                    const nowTime = dayjs().valueOf()
                    if (nowTime - lastTime < 60000) {
                        return res.send({
                            status: 429,
                            msg: `发送邮件过于频繁，请等${Math.ceil(
                                (60000 - (nowTime - lastTime)) / 1000
                            )}秒后再试`
                        })
                    }
                }

                // 生成验证码
                const randomCode = Math.floor(100000 + Math.random() * 900000)
                await EmailCode.create({
                    code: randomCode.toString(),
                    email: req.body.email,
                    expire: dayjs().add(10, 'minute').valueOf(),
                    sendTime: dayjs().valueOf(),
                    ip: req.userIp
                })

                // 发送邮件
                try {
                    await sendMail({
                        subject: 'Nya - Account 注册验证码',
                        to: req.body.email,
                        html: getMailTemplate('register').replace(
                            /{{code}}/g,
                            randomCode.toString()
                        )
                    })
                } catch (e) {
                    logger.error(e)
                }

                return res.send({
                    status: 200,
                    msg: '注册邮件已发送',
                    data: {
                        captcha: true,
                        isRegister: true,
                        authenticationType: 'email',
                        tips: `我们已经向 ${req.body.email} 发送了一封含有验证码的邮件，请注意查收`
                    }
                })
            }
        }

        // 如果用户输入的是用户名，判断需要用户输入的是密码还是邮箱验证码

        // 先判断有没有这个用户
        const result = await User.findOne({
            where: {
                [type]: req.body.email
            },
            include: [
                {
                    model: Authenticator,
                    as: 'authenticators'
                }
            ]
        })
        if (!result) {
            // 用户不存在，返回需要密码
            return res.send({
                status: 200,
                msg: '获取用户信息成功',
                data: {
                    authenticationType: 'password',
                    captcha: true,
                    isRegister: false
                }
            })
        }

        if (req.body?.notUseAuthn !== true) {
            // 引导用户使用外部验证器
            const user = result.toJSON() as UserTable & {
                authenticators: AuthenticatorTable[]
            }

            // 判断用户是否拥有外部验证器
            if (user.authenticators.length > 0) {
                const userAuthenticators: AuthenticatorTable[] = user.authenticators

                const options = await generateAuthenticationOptions({
                    rpID: await getWebAuthnRpId(),
                    allowCredentials: userAuthenticators.map((e) => {
                        return {
                            id: base64ToUint8Array(e.credentialID),
                            type: 'public-key' as const,
                            transports: JSON.parse(e.transports)
                        }
                    }),
                    userVerification: 'preferred',
                    timeout: 60000
                })

                try {
                    await AuthenticatorOptions.create({
                        type: 'use',
                        uid: user.uid,
                        options: JSON.stringify(options),
                        update_time: dayjs().valueOf()
                    })
                } catch (error) {
                    return res.send({
                        status: 500,
                        msg: '无法生成外部验证器选项，请稍后再试'
                    })
                }

                return res.send({
                    status: 200,
                    msg: '获取用户信息成功',
                    data: {
                        authenticationType: 'authenticator',
                        captcha: false,
                        isRegister: false,
                        avatar: await getAvatar(user.email.toString()),
                        options
                    }
                })
            }
        }

        // 判断需要什么验证方式
        if (
            (await recentLogin(result.get('uid').toString(), req.headers.fingerprint)) > 2
        ) {
            // 用户近期登录成功次数大于 2 次，仅验证密码既可
            return res.send({
                status: 200,
                msg: '获取用户信息成功',
                data: {
                    authenticationType: 'password',
                    captcha: await needCaptcha(
                        result.get('uid').toString(),
                        req.headers.fingerprint
                    ),
                    isRegister: false,
                    avatar: await getAvatar(result.get('email').toString())
                }
            })
        }

        // 需要进行滑动验证码挑战
        if (!checkValue(req?.body?.captcha?.randstr, req?.body?.captcha?.ticket)) {
            return res.send({
                status: 422,
                msg: '需要验证码',
                data: {
                    captcha: true
                }
            })
        }

        // 验证验证码
        const checkResult = await checkTicket(
            req.body.captcha.ticket,
            req.body.captcha.randstr
        )
        if (checkResult.status !== 200) {
            return res.send({
                status: checkResult.status,
                msg: '验证码验证不通过：' + checkResult.msg
            })
        }

        // 发送验证码
        const sendResult = await sendEmailCode(
            result,
            req.userIp,
            'login',
            'Nya - Account 登录验证码'
        )

        if (!sendResult.status) {
            return res.send({
                status: 500,
                msg: sendResult.msg
            })
        }

        return res.send({
            status: 200,
            msg: '获取用户信息成功',
            data: {
                authenticationType: 'email',
                captcha: await needCaptcha(
                    result.get('uid').toString(),
                    req.headers.fingerprint
                ),
                isRegister: false,
                avatar: await getAvatar(req.body.email),
                tips: `我们已经向 ${hideMail(
                    result.get('email').toString()
                )} 发送了一封含有验证码的邮件，请注意查收`
            }
        })
    }
)

export default router
