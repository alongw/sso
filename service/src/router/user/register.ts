import { Router } from 'express'
import { Op, Sequelize } from 'sequelize'
import dayjs from 'dayjs'
import checkValue from './../../utils/checkValue'
import { User, EmailCode } from './../../database/table'
import token from './../../utils/token'
import { checkTicket } from './../../utils/captcha'
import { Request } from './../../types/request'

const router = Router()

router.post(
    '/',
    async (
        req: Request<{
            email: string | undefined
            captcha:
                | {
                      randstr: string | undefined
                      ticket: string | undefined
                  }
                | undefined
            code: string | undefined
            keep: boolean | undefined
        }>,
        res
    ) => {
        if (
            !checkValue(
                req.body,
                req.body.captcha?.randstr,
                req.body.captcha?.ticket,
                req.body.code,
                req.body.email
            )
        ) {
            return res.send({
                status: 400,
                msg: '参数错误'
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

        // 判断是不是邮箱
        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(req.body.email)) {
            return res.send({
                status: 400,
                msg: '邮箱格式错误'
            })
        }

        // 判断验证码是否正确
        const emailCode = await EmailCode.findOne({
            where: {
                email: req.body.email,
                code: req.body.code,
                expire: {
                    [Op.gte]: Sequelize.fn('UNIX_TIMESTAMP', Sequelize.col('expire'))
                }
            }
        })
        if (!emailCode) {
            return res.send({
                status: 403,
                msg: '验证码错误'
            })
        }

        // 判断用户是否存在
        const resule = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        if (resule) {
            return res.send({
                status: 403,
                msg: '用户已存在，请不用恶意调用接口'
            })
        }

        // 注册用户
        const user = await User.create({
            email: req.body.email,
            status: 0,
            group: 1
        })

        return res.send({
            status: 200,
            msg: '注册成功',
            data: {
                token: token(
                    {
                        uid: user.get('uid') as string,
                        group: user.get('group') as number,
                        username: (user.get('username') as string) || '',
                        email: user.get('email') as string,
                        nickname:
                            (user.get('nickname') as string) ||
                            (user.get('username') as string) ||
                            '',
                        status: (user.get('status') as number) || 0,
                        createdAt: user.get('createdAt') as Date,
                        updatedAt: user.get('updatedAt') as Date,
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
