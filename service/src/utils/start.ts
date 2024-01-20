import figlet from 'figlet'

import logger from './log'

export const showStartInfo = () => {
    logger.info('------------------------------------------------------')

    console.log(`${figlet.textSync('Nya Account')}\n`)

    logger.info('-----------------------------------------------------')

    logger.info('')

    logger.info('Nya Account 正在启动...')

    logger.info(
        'Powered by ALONGW | https://www.alongw.cn | https://github.com/alongw/sso'
    )

    logger.info('')

    logger.info('-----------------------------------------------------')
}
