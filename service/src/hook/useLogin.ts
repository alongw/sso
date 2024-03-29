import dayjs from 'dayjs'
import { Op, Sequelize } from 'sequelize'

import { verifyAuthenticationResponse } from '@simplewebauthn/server'

import logger from '@/utils/log'
import { isMail } from '@/utils/mail'
import { getWebAuthnRpId } from '@/utils/system'

import {
    User,
    EmailCode,
    LoginLog,
    AuthenticatorOptions,
    Authenticator
} from '@/database/table'

import type { UserTable, AuthenticatorTable } from '@/types/table'

export const getUser = async (userinput: string) => {
    // 判断是不是邮箱
    const loginType = isMail(userinput) ? 'email' : 'username'
    // 判断账号是否存在
    const result = await User.findOne({
        where: {
            [loginType]: userinput
        },
        include: [
            {
                model: Authenticator,
                as: 'authenticators'
            }
        ]
    })

    if (!result) {
        return {
            status: false,
            msg: '未找到用户'
        }
    }

    return {
        status: true,
        msg: '找到用户',
        data: result.toJSON() as UserTable & {
            authenticators: AuthenticatorTable[]
        }
    }
}

export const useLogin = (
    userinput: string,
    codeinput: string,
    ua: string,
    fingerprint: string,
    ip: string,
    captcha: boolean
) => {
    const writeLoginLog = async (uid: string, type: string) => {
        try {
            await LoginLog.create({
                uid,
                ip,
                captcha,
                ua,
                type,
                time: dayjs().valueOf(),
                fingerprint
            })
        } catch (error) {
            logger.error('写入登录记录失败！' + error)
            return false
        }

        return true
    }

    const checkLogin = async () => {
        const userInfo = await getUser(userinput)

        const email = async () => {
            if (!userInfo.status) {
                return {
                    status: 403,
                    msg: '登录失败，请重试'
                }
            }

            const emailCode = await EmailCode.findOne({
                where: {
                    email: userInfo.data.email,
                    code: codeinput,
                    expire: {
                        [Op.gte]: Sequelize.fn('UNIX_TIMESTAMP', Sequelize.col('expire'))
                    }
                }
            })

            if (!emailCode) {
                // 写入失败登录记录
                await writeLoginLog(userInfo.data.uid, 'FailedEmail')

                return {
                    status: 403,
                    msg: '登录失败，请重试'
                }
            }

            const writeResult = await writeLoginLog(userInfo.data.uid, 'mail')

            if (!writeResult) {
                return {
                    status: 500,
                    msg: '出现了内部错误，请重试'
                }
            }

            return {
                status: 200,
                msg: '登录成功',
                user: userInfo.data
            }
        }

        const password = async () => {
            if (!userInfo.status) {
                return {
                    status: 403,
                    msg: '登录失败，请重试'
                }
            }

            const loginType = isMail(userinput) ? 'email' : 'username'
            // 判断密码是否正确
            const user = await User.findOne({
                where: {
                    [loginType]: userinput,
                    password: CryptoJS.MD5(codeinput).toString()
                }
            })
            if (!user) {
                // 写入失败登录记录
                await writeLoginLog(userInfo.data.uid, 'FailedPassword')
                return {
                    status: 403,
                    msg: '登录失败，请重试'
                }
            }

            const writeResult = await writeLoginLog(userInfo.data.uid, 'password')

            if (!writeResult) {
                return {
                    status: 500,
                    msg: '出现了内部错误，请重试'
                }
            }

            return {
                status: 200,
                msg: '登录成功',
                user: userInfo.data
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const authenticator = async (authn: any) => {
            if (!userInfo.status || !authn) {
                return {
                    status: 403,
                    msg: '登录失败，请重试'
                }
            }

            let optionData
            try {
                const result = await AuthenticatorOptions.findOne({
                    where: {
                        uid: userInfo.data.uid,
                        type: 'use',
                        update_time: {
                            [Op.gte]: dayjs().subtract(5, 'minute').valueOf()
                        }
                    }
                })

                if (!result) {
                    return {
                        status: 400,
                        msg: '未找到记录'
                    }
                }

                await result.update({
                    used: true
                })

                optionData = JSON.parse(result.toJSON().options)
            } catch (error) {
                logger.error('获取注册选项失败！' + error)
                return {
                    status: 500,
                    msg: '出错了，请稍后再试'
                }
            }

            const expectedChallenge = optionData.challenge

            const authenticator = userInfo.data.authenticators.find((e) => {
                return e.credentialID === authn.id
            })

            if (!authenticator) {
                return {
                    status: 403,
                    msg: '错误的凭证'
                }
            }

            let verification
            try {
                verification = await verifyAuthenticationResponse({
                    response: authn,
                    expectedChallenge,
                    expectedOrigin: origin,
                    expectedRPID: await getWebAuthnRpId(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    authenticator: {
                        ...authenticator,
                        transports: JSON.parse(authenticator.transports)
                    }
                })
            } catch (error) {
                // 写入登录记录
                await writeLoginLog(userInfo.data.uid, 'authenticatorFailed')
                return {
                    status: 400,
                    msg: '验证失败'
                }
            }

            if (!verification.verified) {
                // 写入登录记录
                await writeLoginLog(userInfo.data.uid, 'authenticatorFailed')
                return {
                    status: 400,
                    msg: '验证失败'
                }
            }

            // 写入登录记录
            const writeResult = await writeLoginLog(userInfo.data.uid, 'authenticator')
            if (!writeResult) {
                return {
                    status: 500,
                    msg: '出错了，请稍后再试'
                }
            }

            // 更新验证器使用次数
            try {
                await Authenticator.update(
                    {
                        counter: authenticator.counter + 1
                    },
                    {
                        where: {
                            credentialID: authenticator.credentialID
                        }
                    }
                )
            } catch (error) {
                logger.error('更新验证器使用次数失败！' + error)
                return {
                    status: 500,
                    msg: '出错了，请稍后再试'
                }
            }

            return {
                status: 200,
                msg: '登录成功',
                user: userInfo.data
            }
        }

        return {
            email,
            password,
            authenticator
        }
    }

    return {
        checkLogin
    }
}
