/* eslint-disable @typescript-eslint/no-unused-vars */
import logger from './utils/log.js'
import sql from './utils/db.js'

import { showStartInfo, checkDatabase, initialExpress } from './utils/start.js'
import { getDatabaseVersion } from './utils/system.js'

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

await checkDatabase().then(() => {
    showStartInfo()
})
await initialExpress()
