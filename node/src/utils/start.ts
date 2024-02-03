import figlet from 'figlet'
import sql from './db.js'
import logger from './log.js'
import app from './express.js'
import { getSystemVersion, getNodePort, getNodeBaseUrl } from './system.js'

export const showStartInfo = () => {
    logger.info('------------------------------------------------------')

    console.log(`${figlet.textSync('Nya Account Node')}\n`)

    logger.info('-----------------------------------------------------')

    logger.info('')

    logger.info('Nya Account Node 正在启动...')

    logger.info(
        'Powered by ALONGW | https://www.alongw.cn | https://github.com/alongw/sso'
    )

    logger.info(`Nya Account Node - v${getSystemVersion()}`)

    logger.info('')

    logger.info('-----------------------------------------------------')
}

export const checkDatabase = async () => {
    logger.info('重新测试数据库连接...')
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
    app.use(await getNodeBaseUrl(), async (req, res, next) =>
        (await import('./../router/index.js')).default(req, res, next)
    )
    logger.info('初始化服务器...')
    const port = await getNodePort()
    app.listen(port, () => {
        logger.info(`Nya Account 授权节点服务器正在端口 ${port} 上运行`)
    })
}
