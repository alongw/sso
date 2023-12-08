import figlet from 'figlet'
import logger from './utils/log.js'

console.log(`\n${figlet.textSync('Nia - Images')}\n`)
logger.info(`Nia - Images 正在启动`)

await import('./utils/start.js')
