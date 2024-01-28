import { Router } from 'express'
import dayjs from 'dayjs'
import checkValue from './../../utils/checkValue'
import { checkTicket } from './../../utils/captcha'
import { sendMail, getMailTemplate } from './../../utils/mail'
import { User, EmailCode } from './../../database/table'
import { Request } from '../../types/request'

const router = Router()

router.use('/login', async (req, res, next) =>
    (await import('./login')).default(req, res, next)
)

router.use('/register', async (req, res, next) =>
    (await import('./register')).default(req, res, next)
)

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
        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(req.body.email)) {
            return res.send({
                status: 418,
                msg: '邮箱格式错误',
                type: 'error'
            })
        }

        // 获取用户是否注册
        const result = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        if (!result) {
            // 未注册 提示用户经过滑动验证码挑战
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
                sendTime: dayjs().valueOf()
            })

            // 发送邮件
            await sendMail({
                subject: 'Nya - Account 注册验证码',
                to: req.body.email,
                html: getMailTemplate('register').replace(
                    /{{code}}/g,
                    randomCode.toString()
                )
            })

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
)

export default router
