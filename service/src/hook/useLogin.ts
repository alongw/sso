import dayjs from 'dayjs'
import { Op } from 'sequelize'

import { verifyAuthenticationResponse } from '@simplewebauthn/server'

import logger from '@/utils/log'
import { isMail } from '@/utils/mail'
import { getWebAuthnRpId, getWebAuthnRpOrigin } from '@/utils/system'

import { User, LoginLog, AuthenticatorOptions, Authenticator } from '@/database/table'

import { useMailCode } from '@/hook/useMailCode'

import { base64ToUint8Array } from '@/utils/covertUint8Array'

import { isoBase64URL, isoUint8Array } from '@simplewebauthn/server/helpers'

import type { UserTable, AuthenticatorTable } from '@/types/table'

import { USER_LOGIN_TYPE } from '@/types'

const { checkEmailCode } = useMailCode()

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
    const writeLoginLog = async (uid: string, type: USER_LOGIN_TYPE, result: boolean) => {
        try {
            await LoginLog.create({
                uid,
                ip,
                captcha,
                ua,
                type,
                time: dayjs().valueOf(),
                fingerprint,
                result
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

            // 效验验证码
            const checkResult = await checkEmailCode(userInfo.data, codeinput, 'login')

            if (!checkResult.status) {
                // 写入失败登录记录
                await writeLoginLog(userInfo.data.uid, USER_LOGIN_TYPE.EMAIL, false)

                return {
                    status: 403,
                    msg: '登录失败，请重试'
                }
            }
            try {
                const writeResult = await writeLoginLog(
                    userInfo.data.uid,
                    USER_LOGIN_TYPE.EMAIL,
                    true
                )

                if (!writeResult) {
                    return {
                        status: 500,
                        msg: '出现了内部错误，请重试'
                    }
                }
            } catch (error) {
                logger.error('写入登录记录失败！' + error)
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
            try {
                // 判断密码是否正确
                const user = await User.findOne({
                    where: {
                        [loginType]: userinput,
                        password: CryptoJS.MD5(codeinput).toString()
                    }
                })
                if (!user) {
                    // 写入失败登录记录
                    await writeLoginLog(
                        userInfo.data.uid,
                        USER_LOGIN_TYPE.PASSWORD,
                        false
                    )
                    return {
                        status: 403,
                        msg: '登录失败，请重试'
                    }
                }

                const writeResult = await writeLoginLog(
                    userInfo.data.uid,
                    USER_LOGIN_TYPE.PASSWORD,
                    true
                )

                if (!writeResult) {
                    return {
                        status: 500,
                        msg: '出现了内部错误，请重试'
                    }
                }
            } catch (error) {
                logger.error('数据库出错！' + error)
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
                        // 用户可能会多次验证，所以这里不限制 used
                        // used: false,
                        update_time: {
                            [Op.gte]: dayjs().subtract(5, 'minute').valueOf()
                        }
                    },
                    order: [['update_time', 'DESC']]
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

            const authenticator = userInfo.data.authenticators.find((e) => {
                const devCredIDUint8Array = base64ToUint8Array(e.credentialID)
                return isoUint8Array.areEqual(
                    devCredIDUint8Array,
                    isoBase64URL.toBuffer(authn.rawId)
                )
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
                    expectedChallenge: optionData.challenge,
                    expectedOrigin: await getWebAuthnRpOrigin(),
                    expectedRPID: await getWebAuthnRpId(),
                    authenticator: {
                        ...authenticator,
                        credentialPublicKey: base64ToUint8Array(
                            authenticator.credentialPublicKey
                        ),
                        credentialID: base64ToUint8Array(authenticator.credentialID),
                        transports: JSON.parse(authenticator.transports)
                    },
                    requireUserVerification: false
                })
            } catch (error) {
                // 写入登录记录
                try {
                    await writeLoginLog(
                        userInfo.data.uid,
                        USER_LOGIN_TYPE.AUTHENTICATOR,
                        false
                    )
                } catch (error) {
                    logger.error('写入登录记录失败！' + error)
                    return {
                        status: 500,
                        msg: '出错了，请稍后再试'
                    }
                }
                return {
                    status: 400,
                    msg: '验证失败'
                }
            }

            if (!verification.verified) {
                try {
                    await writeLoginLog(
                        userInfo.data.uid,
                        USER_LOGIN_TYPE.AUTHENTICATOR,
                        false
                    )
                } catch (error) {
                    logger.error('写入登录记录失败！' + error)
                    return {
                        status: 500,
                        msg: '出错了，请稍后再试'
                    }
                }
                return {
                    status: 400,
                    msg: '验证失败'
                }
            }

            // 写入登录记录
            try {
                const writeResult = await writeLoginLog(
                    userInfo.data.uid,
                    USER_LOGIN_TYPE.AUTHENTICATOR,
                    true
                )
                if (!writeResult) {
                    return {
                        status: 500,
                        msg: '出错了，请稍后再试'
                    }
                }
            } catch (error) {
                logger.error('写入登录记录失败！' + error)
                return {
                    status: 500,
                    msg: '出错了，请稍后再试'
                }
            }

            // 更新验证器使用次数
            try {
                await Authenticator.update(
                    {
                        counter: verification.authenticationInfo.newCounter
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
