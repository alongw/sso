import figlet from 'figlet'
import sql from './sql'
import logger from './log'

import { getSystemVersion, getDatabaseVersion } from './system'

export const showStartInfo = () => {
    logger.info('------------------------------------------------------')

    console.log(`${figlet.textSync('Nya Account')}\n`)

    logger.info('-----------------------------------------------------')

    logger.info('')

    logger.info('Nya Account 正在启动...')

    logger.info(
        'Powered by ALONGW | https://www.alongw.cn | https://github.com/alongw/sso'
    )

    logger.info(`Nya Account - v${getSystemVersion()}`)

    logger.info('')

    logger.info('-----------------------------------------------------')
}

export const checkDatabase = async () => {
    logger.info('开始连接数据库...')
    try {
        await sql.authenticate()
        logger.info('数据库连接成功')
    } catch (error) {
        logger.error('数据库连接失败，请检查数据库配置')
        logger.error(error)
        process.exit(0)
    }
}

export const syncDatabase = async () => {
    logger.info('开始同步数据库...')
    try {
        await sql.sync({ alter: true })
        logger.info('数据库同步成功')
    } catch (error) {
        logger.error('数据库同步失败')
        logger.error(error)
        process.exit(0)
    }
    logger.info(`当前数据库版本：${await getDatabaseVersion()}`)
}

export const initialExpress = () => {}
