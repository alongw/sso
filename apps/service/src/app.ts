import figlet from 'figlet'
import express from 'express'
import { logger, useConfig } from '@nya-account/common'

// 显示启动信息
logger.info('------------------------------------------------------')
console.log(`${figlet.textSync('Nya Account')}\n`)
logger.info('-----------------------------------------------------')
logger.info('')
logger.info('Nya Account 正在启动...')
logger.info('Powered by ALONGW | https://www.alongw.cn | https://github.com/alongw/sso')

const config = useConfig('service')

const app = express()

const listenPort = await config.getConfig('port')

app.listen(listenPort, () => {
    logger.info(`nya account service is running on port ${listenPort}`)
})
