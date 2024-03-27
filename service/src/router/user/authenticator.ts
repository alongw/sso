import { Router } from 'express'
import dayjs from 'dayjs'
import {
    generateRegistrationOptions,
    verifyRegistrationResponse
} from '@simplewebauthn/server'

import { Authenticator, User, AuthenticatorOptions } from '@/database/table'

import { getWebAuthnRpId, getWebAuthnRpName } from '@/utils/system'

import type { Request } from '@/types/request'
import type { UserTable, AuthenticatorTable } from '@/types/table'

const router = Router()

router.get('/', async (req: Request, res) => {
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

        const options = await generateRegistrationOptions({
            rpName: await getWebAuthnRpName(),
            rpID: await getWebAuthnRpId(),
            userID: userInfo.uid,
            userName: userInfo.username,
            attestationType: 'none',
            excludeCredentials: userInfo.authenticators.map((e) => {
                return {
                    id: e.credentialID,
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
})

router.post('/', async (req: Request, res) => {
    if (!req.body || !req.body.options) {
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
                    $gt: dayjs().subtract(5, 'minute').valueOf()
                }
            }
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
            expectedOrigin: origin,
            expectedRPID: await getWebAuthnRpId()
        })
    } catch (error) {
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
            credentialID: verification.registrationInfo.credentialID,
            counter: verification.registrationInfo.counter,
            credentialPublicKey: verification.registrationInfo.credentialPublicKey,
            credentialDeviceType: verification.registrationInfo.credentialDeviceType,
            credentialBackedUp: verification.registrationInfo.credentialBackedUp
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
})

export default router
