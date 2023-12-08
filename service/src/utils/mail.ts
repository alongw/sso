import { createTransport } from 'nodemailer'
import { getConfig } from './config.js'

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

const transport = createTransport(await getConfig('app', 'mail'))

/*
*use
*   await sendMail({
*       from: 'IKUN技术公司<info-api-mail@liyxi.com>',
*       subject: '主题',
*       to: 接收者,
*       html: 内容
})
*/
export const sendMail = (
    mailOptions: Mail.Options
): Promise<SMTPTransport.SentMessageInfo> => {
    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                return reject(err)
            }
            resolve(info)
        })
    })
}

// use
// await sendMail({
//     from: 'IKUN技术公司<info-api-mail@liyxi.com>',
//     subject: '主题',
//     to: 接收者,
//     html: 内容
// })
