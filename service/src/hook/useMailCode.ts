import { EmailCode } from '@/database/table'
import dayjs from 'dayjs'
import { Op } from 'sequelize'

import { getMailTemplate, sendMail } from '@/utils/mail'

import type { UserTable } from '@/types/table'
import { Model } from 'sequelize'
import logger from '@/utils/log'

export const useMailCode = () => {
    const sendEmailCode = async (
        user: Model<UserTable>,
        ip: string,
        template: string,
        title: string
    ) => {
        const userInfo = user.toJSON()

        // 频繁发送邮件检测
        try {
            const lastEmailCode = await EmailCode.findOne({
                where: {
                    email: userInfo.email,
                    ip,
                    used: false,
                    sendTime: {
                        [Op.gt]: dayjs().subtract(1, 'minute').valueOf()
                    }
                }
            })

            if (lastEmailCode) {
                return {
                    status: false,
                    msg: '发送邮件过于频繁，请稍后再试'
                }
            }
        } catch (error) {
            return {
                status: false,
                msg: '发生了内部错误'
            }
        }

        // 生成验证码
        const randomCode = Math.floor(100000 + Math.random() * 900000)

        // 写入数据库
        try {
            await EmailCode.create({
                code: randomCode.toString(),
                email: userInfo.email,
                ip,
                expire: dayjs().add(10, 'minute').valueOf(),
                sendTime: dayjs().valueOf(),
                used: false,
                useTime: 0,
                type: template
            })
        } catch (error) {
            return {
                status: false,
                msg: '发生了内部错误'
            }
        }

        // 生成邮件内容
        let html = getMailTemplate(template).replace('{{code}}', randomCode.toString())

        // 发送邮件
        try {
            await sendMail({
                subject: title,
                to: userInfo.email,
                html: html
            })
        } catch (error) {
            logger.error(`[MAIL] - 发送邮件失败：${error}`)
            return {
                status: false,
                msg: '发送邮件失败'
            }
        }

        html = undefined

        return {
            status: true,
            msg: '发送邮件成功'
        }
    }

    // 效验验证码
    const checkEmailCode = async (
        user: Model<UserTable> | UserTable,
        code: string,
        type: string
    ) => {
        // 判断是否为 Model
        if (user instanceof Model) {
            user = user.toJSON()
        }
        try {
            const emailCode = await EmailCode.findOne({
                where: {
                    email: user.email,
                    code,
                    type,
                    used: false,
                    expire: {
                        [Op.gt]: dayjs().valueOf()
                    }
                },
                order: [['sendTime', 'DESC']]
            })

            if (!emailCode) {
                return {
                    status: false,
                    msg: '验证码错误或已失效'
                }
            }

            await emailCode.update(
                {
                    used: true,
                    useTime: dayjs().valueOf()
                },
                {
                    where: {
                        used: false
                    }
                }
            )

            return {
                status: true,
                msg: '验证码正确'
            }
        } catch (error) {
            return {
                status: false,
                msg: '发生了内部错误'
            }
        }
    }

    return {
        sendEmailCode,
        checkEmailCode
    }
}
