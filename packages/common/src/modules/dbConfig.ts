import { Config } from '@nya-account/db'
import { logger } from '@nya-account/common'

const defaultConfig = {
    global_encode_secret: 'f881c6163132cd554088b56a62d4a1ed',
    service_base_url: '/api',
    service_jwt_unless: ['/public'],
    service_jwt_secret: 'f881c6163132cd554088b56a62d4a1ed',
    service_listen_port: 10086,
    node_application_jwt_secret: 'f881c6163132cd554088b56a62d4a1ed',
    node_base_url: '/node',
    node_listen_port: 10010,
    node_create_user_uuid_key: 'f881c6163132cd554088b56a62d4a1ed',
    web_authn_rpid: 'localhost',
    web_authn_rporigin: 'https://localhost',
    web_authn_rpname: 'Nya Account'
}

export const getConfig = async <T extends keyof typeof defaultConfig>(key: T) => {
    // 判断配置字段是否存在 defaultConfig 中
    if (!defaultConfig[key]) {
        return null
    }

    // 从数据库中查找配置
    try {
        const [config, created] = await Config.findOrCreate({
            where: {
                key: key
            },
            defaults: {
                key: key,
                value: JSON.stringify(defaultConfig[key]),
                id: undefined as unknown as number
            }
        })

        if (created) {
            logger.warn(`在数据库中未找到配置项 ${key}，已自动创建`)
        }

        return JSON.parse(config.toJSON().value) as (typeof defaultConfig)[T]
    } catch (error) {
        logger.error(`获取配置项 ${key} 时出现错误：${error}`)
        return null
    }
}
