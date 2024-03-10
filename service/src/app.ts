/* eslint-disable @typescript-eslint/no-unused-vars */
import logger from './utils/log'
import sql from './utils/db'

import { showStartInfo, checkDatabase, initialExpress } from './utils/start'
import { getDatabaseVersion } from './utils/system'

logger.info(`当前数据库版本：${await getDatabaseVersion()}`)

await checkDatabase().then(() => {
    showStartInfo()
})
await initialExpress()
