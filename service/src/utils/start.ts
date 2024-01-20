import figlet from 'figlet'

import logger from './log'

import { getSystemVersion } from './system'

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
