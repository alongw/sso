import { createTransport } from 'nodemailer'
import fse from 'fs-extra'
import { getMail } from './system'
import logger from './log'

import type Mail from 'nodemailer/lib/mailer'

import type SMTPTransport from 'nodemailer/lib/smtp-transport'

// const mail = await getConfig('app', 'mail')

// export const transporter = nodemailer.createTransport(mail)

// export const sendMail = (config: {
//     from: string
//     to: string
//     subject: string
//     html: string
// }) => {
//     return transporter.sendMail(config)
// }

const info = await getMail()

const transport = createTransport(info)

export const sendMail = (
    mailOptions: Mail.Options
): Promise<SMTPTransport.SentMessageInfo> => {
    return new Promise((resolve, reject) => {
        transport.sendMail(
            {
                ...mailOptions,
                from: info.from
            },
            (err, info) => {
                if (err) {
                    logger.error(`[MAIL] - 发生错误：${err}`)
                    return reject(err)
                }
                logger.info(`[MAIL] - 已向 ${mailOptions.to} 发送邮件`)
                resolve(info)
            }
        )
    })
}

export const getMailTemplate = (name: string) => {
    return fse.readFileSync(`./template/mail/${name}.html`).toString()
}

export const isMail = (mail: string) => {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(mail)
}

export const hideMail = (mail: string) => {
    const atIndex = mail.indexOf('@')
    if (atIndex !== -1) {
        const username = mail.substring(0, atIndex)
        const hiddenUsername =
            username.length >= 2
                ? username.substring(0, 2) + '*'.repeat(username.length - 2)
                : username
        const domain = mail.substring(atIndex)

        return hiddenUsername + domain
    } else {
        return mail
    }
}
