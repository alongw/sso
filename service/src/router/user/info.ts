import { Router } from 'express'
import dayjs from 'dayjs'
import validator from 'validator'
import CryptoJS from 'crypto-js'

import { Sequelize, Op } from 'sequelize'
import logger from './../../utils/log'
import { sendMail, getMailTemplate } from './../../utils/mail'

import { EmailCode } from './../../database/table'

import checkValue from './../../utils/checkValue'
import { checkTicket } from './../../utils/captcha'

import { User } from './../../database/table'

import { Request } from './../../types/request'

const router = Router()

router.post(
    '/getCode',
    async (
        req: Request<{
            randstr: string | undefined
            ticket: string | undefined
            email: string | undefined
        }>,
        res
    ) => {
        if (!checkValue(req.body.randstr, req.body.ticket)) {
            return res.send({
                status: 400,
                msg: '参数错误'
            })
        }

        // 效验验证码
        const checkResult = await checkTicket(req.body.ticket, req.body.randstr)
        if (checkResult.status !== 200) {
            return res.send({
                status: checkResult.status,
                msg: '验证码验证不通过：' + checkResult.msg
            })
        }

        const result = await User.findOne({
            where: {
                uid: req.user.uid
            }
        })

        if (!result) {
            return res.send({
                status: 400,
                msg: '用户不存在'
            })
        }

        const userEmail = result.toJSON().email

        const email = req.body.email ? req.body.email : userEmail

        if (!email) {
            return res.send({
                status: 400,
                msg: '邮箱不能为空'
            })
        }

        // 检查邮箱格式
        if (!validator.isEmail(email)) {
            return res.send({
                status: 400,
                msg: '邮箱格式错误'
            })
        }

        const result2 = await EmailCode.findAll({
            where: {
                email: email
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
            email: email,
            expire: dayjs().add(10, 'minute').valueOf(),
            sendTime: dayjs().valueOf(),
            ip: req.ip
        })

        // 发送邮件
        try {
            await sendMail({
                subject: 'Nya - Account 登录验证码',
                to: email,
                html: getMailTemplate('sensitive').replace(
                    /{{code}}/g,
                    randomCode.toString()
                )
            })
        } catch (error) {
            logger.error(error)
        }

        return res.send({
            status: 200,
            msg: '邮件已发送'
        })
    }
)

router.get('/', async (req: Request, res) => {
    const result = await User.findOne({
        where: {
            uid: req.user.uid
        }
    })

    return res.send({
        status: 200,
        msg: '用户信息获取成功',
        data: {
            uid: result?.get('uid'),
            username: result?.get('username'),
            email: result?.get('email'),
            avatar: `https://cravatar.cn/avatar/${CryptoJS.MD5(
                result.get('email').toString()
            )}`,
            status: result?.get('status'),
            nickname: result?.get('nickname'),
            group: result?.get('group'),
            createTime: dayjs(result?.get('createdAt').toString()).format(
                'YYYY-MM-DD HH:mm:ss'
            ),
            password: result?.get('password') === null ? false : true,
            public_email: result?.get('public_email')
        }
    })
})

router.put('/', async (req: Request, res) => {
    // 获取用户信息
    const result = await User.findOne({
        where: {
            uid: req.user.uid
        }
    })

    if (!result) {
        return res.send({
            status: 400,
            msg: '用户不存在'
        })
    }

    if (req.body?.public_email && req.body?.email) {
        return res.send({
            status: 403,
            msg: '禁止同时修改多个邮箱'
        })
    }

    // 如果修改密码或者邮箱，需要验证码
    if (req.body?.password || req.body?.email || req.body?.public_email) {
        if (!checkValue(req.body.code)) {
            return res.send({
                status: 400,
                msg: '需要邮箱验证码'
            })
        }

        // 检查验证码
        const emailCode = await EmailCode.findOne({
            where: {
                email: req?.body?.public_email || result.get('email'),
                code: req.body.code,
                expire: {
                    [Op.gte]: Sequelize.fn('UNIX_TIMESTAMP', Sequelize.col('expire'))
                }
            }
        })

        if (req.body?.email) {
            if (!checkValue(req.body.code2)) {
                return res.send({
                    status: 400,
                    msg: '参数错误'
                })
            }

            // 检查新邮箱验证码
            const newEmailCode = await EmailCode.findOne({
                where: {
                    email: req.body?.email,
                    code: req.body.code2,
                    expire: {
                        [Op.gte]: Sequelize.fn('UNIX_TIMESTAMP', Sequelize.col('expire'))
                    }
                }
            })
            if (!newEmailCode || newEmailCode.get('code') !== req.body.code2) {
                return res.send({
                    status: 400,
                    msg: '新邮箱验证码错误'
                })
            }
        }

        if (req.body?.password) {
            if (!validator.isByteLength(req.body.password, { min: 6, max: 30 })) {
                return res.send({
                    status: 400,
                    msg: '密码长度错误'
                })
            }
        }

        if (!emailCode) {
            return res.send({
                status: 400,
                msg: '验证码错误'
            })
        }
    }

    const user = result.toJSON()

    // 修改用户信息
    await result.update({
        nickname: req.body?.nickname || user.nickname,
        email: req.body?.email || user.email,
        password: req.body?.password
            ? CryptoJS.MD5(req.body?.password).toString()
            : user.password,
        public_email: req.body?.public_email || user.public_email
    })

    return res.send({
        status: 200,
        msg: '修改成功'
    })
})

export default router
