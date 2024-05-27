import { LoginLog, AuthLog } from '@/database/table'

import logger from '@/utils/log'

import type { USER_UID_TYPE } from '@/types'

export const useLoginLogs = (uid: USER_UID_TYPE) => {
    const getLogs = async (
        max_number: number
    ): Promise<{
        status: boolean
        msg: string
        data: Array<{
            login_id: number
            login_ip: string
            login_time: number
            login_type: string
            login_result: boolean
            login_ua: string
            login_use_captcha: boolean
        }>
    }> => {
        // 最大获取 50 条记录
        if (max_number > 50) max_number = 50

        try {
            const result = await LoginLog.findAll({
                where: {
                    uid
                },
                order: [['time', 'DESC']],
                limit: max_number
            })

            const logs = result.map((e) => e.toJSON())

            return {
                status: true,
                msg: '获取成功',
                data: logs.map((e) => {
                    return {
                        login_id: e.id,
                        login_ip: e.ip.includes(',') ? e.ip.split(',')[0] : e.ip,
                        login_time: e.time,
                        login_type: e.type,
                        login_result: e.result,
                        login_ua: e.ua,
                        login_use_captcha: e.captcha
                    }
                })
            }
        } catch (error) {
            logger.error(
                '获取登录记录失败' +
                    error +
                    `具体信息：uid=${uid}，max_number=${max_number}，msg=${error.message}`
            )
            return {
                status: false,
                msg: '获取登录记录失败',
                data: []
            }
        }
    }

    return {
        getLogs
    }
}

export const useAuthLogs = (uid: USER_UID_TYPE) => {
    const getLogs = async (max_number: number) => {
        // 最大 30 条记录
        if (max_number > 30 || max_number < 0) max_number = 30

        // 获取授权记录
        try {
            const result = await AuthLog.findAll({
                where: {
                    uid
                },
                order: [['time', 'DESC']],
                limit: max_number
            })

            const logs = result.map((e) => e.toJSON())

            return {
                status: true,
                msg: '获取成功',
                data: logs.map((e) => {
                    return {
                        auth_id: e.id,
                        auth_appid: e.appid,
                        auth_ip: e.ip.includes(',') ? e.ip.split(',')[0] : e.ip,
                        auth_time: e.time,
                        auth_expire: e.exp,
                        auth_ua: e.ua,
                        auth_use: e.use
                    }
                })
            }
        } catch (error) {
            logger.error('获取授权记录失败' + error)
            return {
                status: false,
                msg: '获取授权记录失败',
                data: []
            }
        }
    }

    return {
        getLogs
    }
}
