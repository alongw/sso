import { query, rawQuery } from './db.js'
import logger from './log.js'
import { cmd, thisVersion } from './../data/sql.js'

logger.info('[数据库更新] - 开始检查更新')

// 判断数据库是否是首次安装
const [aerr, aresult] = await query`show tables like 'system'`
if (aerr) {
    logger.error(`[数据库更新] - 出现严重错误 ${aerr.message} ，请人工处理`)
}

if (aresult.length == 0) {
    logger.warn('[数据库更新] - 检测到数据库为首次连接，即将为您更新')
    logger.info(`[数据库更新] - 准备更新数据库（ 0 → 1 ）`)
    for (const s of cmd[1]) {
        logger.info(`[数据库更新] - 正在升级版本号 1 执行 ${s} 语句中`)
        const [err, result] = await rawQuery(s)
        if (err) {
            logger.error(`[数据库更新] - 出现严重错误 ${err.message} ，请人工处理`)
            process.exit()
        }
        logger.info(`[数据库更新] - 数据库返回 ${JSON.stringify(result)}`)
    }
    logger.info(`[数据库更新] - 升级版本号 1 完成`)
    logger.info(
        `[数据库更新] - 初始化数据库 ( 0 → 1 ) 成功，请修改数据库配置并重新启动本程序`
    )
    process.exit()
}

// 获取数据库版本
const [err, result] = await query<
    {
        version: number
        dbVersion: number
        lock: string
        id: number
    }[]
>`select * from \`system\``

if (err) {
    logger.error(`[数据库更新] - 出现严重错误 ${err.message} ，请人工处理`)
    process.exit()
}

if (result.length == 0) {
    logger.error('[数据库更新] - 数据库数据不完整，请人工处理')
    process.exit()
}

const system = result[0]

logger.info(`[数据库更新] - 获取系统信息`)
logger.info(`--------------------`)
logger.info(`系统版本号：${system.version}`)
logger.info(`数据库版本号：${system.dbVersion}`)
logger.info(`数据库状态: ${system.lock == 'unlock' ? '已解锁（不安全）' : '安全'}`)
logger.info(`--------------------`)

export const checkUpdate = async () => {
    // 检查更新
    if (system.dbVersion >= thisVersion) {
        return logger.info(
            `[数据库更新] - 检查更新通过，数据库版本与程序对应版本相同，将放行下一操作`
        )
    }

    // 更新数据库
    if (system.lock != 'unlock') {
        logger.warn(
            `[数据库更新] - 准备更新数据库（${system.dbVersion} → ${thisVersion}），请前往备份，备份!备份!备份!一定要备份!备份后解锁安全锁并重新启动本程序`
        )
        return process.exit()
    }

    logger.info(`[数据库更新] - 准备更新数据库（${system.dbVersion} → ${thisVersion}）`)

    // 所有版本
    for (let i = system.dbVersion + 1; i <= thisVersion; i++) {
        const sql = cmd[i]
        // 版本语句
        for (const j of sql) {
            logger.info(`[数据库更新] - 正在升级版本号 ${i} 执行 ${j} 语句中`)
            const [err, result] = await rawQuery(j)
            if (err) {
                logger.error(`[数据库更新] - 出现严重错误 ${err.message} ，请人工处理`)
                process.exit()
            }
            logger.info(`[数据库更新] - 数据库返回 ${JSON.stringify(result)}`)
        }
        logger.info(`[数据库更新] - 升级版本号 ${i} 完成`)
    }

    // 修改数据库信息
    await query`UPDATE \`system\` SET dbVersion = ${thisVersion},\`lock\` = ${
        'app-update-success-lock ' + Date.now()
    } WHERE id = 1`

    logger.info(`[数据库更新] - 升级队列执行完毕，请检查是否需要修改配置并重启程序`)
    process.exit()
}
