import figlet from 'figlet'
import sql from './sql'
import logger from './log'
import app from './express'
import { getSystemVersion, getListenPort, getBaseUrl } from './system'

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

export const initialExpress = async () => {
    app.use(await getBaseUrl(), async (req, res, next) =>
        (await import('./../router/index')).default(req, res, next)
    )
    logger.info('初始化服务器...')
    const port = await getListenPort()
    app.listen(port, () => {
        logger.info(`Nya Account 服务器正在端口 ${port} 上运行`)
    })
}
