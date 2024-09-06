import figlet from 'figlet'
import express from 'express'
import { logger } from '@nya-account/common'

// 显示启动信息
logger.info('------------------------------------------------------')
console.log(`${figlet.textSync('Nya Account')}\n`)
logger.info('-----------------------------------------------------')
logger.info('')
logger.info('Nya Account 正在启动...')
logger.info('Powered by ALONGW | https://www.alongw.cn | https://github.com/alongw/sso')

// 初始化 express
const app = express()
