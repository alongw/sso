import { Router } from 'express'
import dayjs from 'dayjs'
import { Op, Sequelize } from 'sequelize'
import {
    generateRegistrationOptions,
    verifyRegistrationResponse
} from '@simplewebauthn/server'

import { Authenticator, User, AuthenticatorOptions } from '@/database/table'

import { getWebAuthnRpId, getWebAuthnRpName } from '@/utils/system'

import { EmailCode } from '@/database/table'

import type { Request } from '@/types/request'
import type { UserTable, AuthenticatorTable } from '@/types/table'
import logger from '@/utils/log'

const router = Router()

router.get('/all', async (req: Request, res) => {
    try {
        const result = await Authenticator.findAll({
            where: {
                owner: req.user.uid
            }
        })

        return res.send({
            status: 200,
            msg: '获取验证器列表成功',
            data: {
                authenticatorList: result.map((e) => {
                    return {
                        credentialID: e.toJSON().credentialID,
                        name: e.toJSON().name,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        createTime: (e as any).toJSON().createdAt
                    }
                })
            }
        })
    } catch (error) {
        return res.send({
            status: 500,
            msg: '不好..里面坏掉了...❤'
        })
    }
})

router.get(
    '/',
    async (
        req: Request<
            undefined,
            {
                emailCode: string
                name: string
            }
        >,
        res
    ) => {
        if (!req.query || !req.query.emailCode) {
            return res.send({
                status: 400,
                msg: '请求参数错误'
            })
        }

        if (req.query.name.length > 16) {
            return res.send({
                status: 403,
                msg: '验证器名称过长'
            })
        }

        // 判断邮箱验证码是否正确
        try {
            const emailCode = await EmailCode.findOne({
                where: {
                    email: req.user.email,
                    code: req.query.emailCode,
                    expire: {
                        [Op.gte]: Sequelize.fn('UNIX_TIMESTAMP', Sequelize.col('expire'))
                    }
                }
            })

            if (!emailCode) {
                return res.send({
                    status: 403,
                    msg: '邮箱验证码错误'
                })
            }
        } catch (error) {
            logger.error('检查邮箱验证码失败', error)
            return res.send({
                status: 500,
                msg: '笨蛋..已经坏掉了...呜哇❤'
            })
        }

        try {
            const result = await User.findOne({
                where: {
                    uid: req.user.uid
                },
                include: [
                    {
                        model: Authenticator,
                        as: 'authenticators'
                    }
                ]
            })

            const userInfo = result.toJSON() as UserTable & {
                authenticators: AuthenticatorTable[]
            }

            if (userInfo.authenticators.length >= 20) {
                return res.send({
                    status: 403,
                    msg: '验证器数量已达上限'
                })
            }

            const options = await generateRegistrationOptions({
                rpName: await getWebAuthnRpName(),
                rpID: await getWebAuthnRpId(),
                userID: userInfo.uid,
                userName: userInfo.username,
                attestationType: 'none',
                excludeCredentials: userInfo.authenticators.map((e) => {
                    return {
                        id: JSON.parse(e.credentialID),
                        type: 'public-key'
                    }
                }),
                authenticatorSelection: {
                    residentKey: 'preferred',
                    userVerification: 'preferred',
                    authenticatorAttachment: 'platform'
                }
            })

            try {
                await AuthenticatorOptions.create({
                    type: 'set',
                    uid: userInfo.uid,
                    options: JSON.stringify(options),
                    update_time: dayjs().valueOf()
                })
            } catch (error) {
                logger.error('创建验证器选项失败', error)
                return res.send({
                    status: 500,
                    msg: '笨蛋！！..里面坏掉了...❤'
                })
            }

            return res.send({
                status: 200,
                msg: '生成注册选项成功',
                data: {
                    options
                }
            })
        } catch (error) {
            return res.send({
                status: 500,
                msg: '不好..里面坏掉了...❤'
            })
        }
    }
)

router.post(
    '/',
    async (
        req: Request<{
            name: string
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options: any
        }>,
        res
    ) => {
        if (
            !req.body ||
            !req.body.options ||
            !req.body.name ||
            req.body.name.length > 16
        ) {
            return res.send({
                status: 400,
                msg: '请求参数错误'
            })
        }
        let optionData
        try {
            const result = await AuthenticatorOptions.findOne({
                where: {
                    uid: req.user.uid,
                    type: 'set',
                    update_time: {
                        [Op.gte]: dayjs().subtract(5, 'minute').valueOf()
                    }
                },
                order: [['update_time', 'DESC']]
            })

            if (!result) {
                return res.send({
                    status: 400,
                    msg: '未找到记录'
                })
            }

            await result.update({
                used: true
            })

            optionData = JSON.parse(result.toJSON().options)
        } catch (error) {
            return res.send({
                status: 500,
                msg: '呜啊..里面坏掉了...❤'
            })
        }

        const expectedChallenge: string = optionData.challenge
        let verification
        try {
            verification = await verifyRegistrationResponse({
                response: req.body.options,
                expectedChallenge,
                expectedOrigin: `https://${await getWebAuthnRpId()}`,
                expectedRPID: await getWebAuthnRpId()
            })
        } catch (error) {
            console.log(error)

            return res.send({
                status: 400,
                msg: '效验验证器失败'
            })
        }

        if (!verification.verified) {
            return res.send({
                status: 400,
                msg: '效验验证器失败'
            })
        }

        // 将验证器信息存入数据库
        try {
            await Authenticator.create({
                owner: req.user.uid,
                credentialID: JSON.stringify(verification.registrationInfo.credentialID),
                counter: verification.registrationInfo.counter,
                credentialPublicKey: verification.registrationInfo.credentialPublicKey,
                credentialDeviceType: verification.registrationInfo.credentialDeviceType,
                credentialBackedUp: verification.registrationInfo.credentialBackedUp,
                name: req.body.name
            })
        } catch (error) {
            return res.send({
                status: 500,
                msg: '坏诶..里面坏掉了...❤'
            })
        }

        return res.send({
            status: 200,
            msg: '创建新外部验证器成功'
        })
    }
)

router.delete(
    '/',
    async (
        req: Request<{
            id: string
        }>,
        res
    ) => {
        if (!req.body || !req.body.id) {
            return res.send({
                status: 400,
                msg: '请求参数错误'
            })
        }

        try {
            const result = await Authenticator.destroy({
                where: {
                    owner: req.user.uid,
                    credentialID: req.body.id
                }
            })

            if (result === 0) {
                return res.send({
                    status: 400,
                    msg: '未找到记录'
                })
            }
        } catch (error) {
            logger.error('删除验证器失败', error)
            return res.send({
                status: 500,
                msg: '不好..里面坏掉了...❤'
            })
        }

        return res.send({
            status: 200,
            msg: '删除验证器成功'
        })
    }
)

export default router
