import logger from './utils/log'
import sql from './utils/sql'

import { showStartInfo, checkDatabase, initialExpress } from './utils/start'
import { getDatabaseVersion } from './utils/system'

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
