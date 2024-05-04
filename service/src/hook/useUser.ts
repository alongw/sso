import { Op } from 'sequelize'
import _ from 'lodash'
import CryptoJS from 'crypto-js'
import validator from 'validator'
import { isMail } from './../utils/mail'
import { User, LoginLog } from './../database/table'

import { USER_LOGIN_TYPE } from '@/types/index'

const getUser = async (account: string) => {
    if (isMail(account)) {
        const res = await User.findOne({
            where: {
                email: account
            }
        })
        return res
    }
    if (validator.isUUID(account, 4)) {
        const res = await User.findOne({
            where: {
                uid: account
            }
        })
        return res
    }
    const res = await User.findOne({
        where: {
            username: account
        }
    })
    return res
}

export const recentLogin = async (account: string, fingerprint: string) => {
    // 获取账号
    const user = await getUser(account)
    // 如果账号不存在
    if (!user) return 0
    const loginLog = await LoginLog.findAll({
        where: {
            uid: user.get('uid'),
            fingerprint,
            time: {
                [Op.gt]: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
            }
        },
        limit: 3
    })

    // 筛选出成功的登录
    const log = loginLog.filter(
        (e) =>
            e.toJSON().type === USER_LOGIN_TYPE.EMAIL ||
            e.toJSON().type === USER_LOGIN_TYPE.PASSWORD
    )
    return log.length
}

export const needCaptcha = async (account: string, fingerprint: string) => {
    if ((await recentLogin(account, fingerprint)) > 3) return false
    return true
}

export const getAvatar = async (account: string) => {
    const user = await getUser(account)
    if (!user) return 'default'
    return `https://cravatar.cn/avatar/${CryptoJS.MD5(
        _.toLower(user.get('email').toString())
    ).toString()}.webp?s=144&d=blank`
}
