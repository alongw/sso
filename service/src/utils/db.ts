/* eslint-disable @typescript-eslint/no-explicit-any */
import mysql, { QueryError, FieldPacket } from 'mysql2'
import { dbConfig } from './localconfig.js'
import logger from './log.js'

const { host, user, password, database, port } = dbConfig.db

logger.info(
    `尝试使用用户 ${user} 密码 *** 连接到远程 SQL 服务器 ${host}:${port} ${database} 数据库`
)

const db = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    charset: 'UTF8MB4_GENERAL_CI'
})

export const rawQuery = <T = any>(
    sql: string,
    data?: any
): Promise<[QueryError, T, FieldPacket[]]> => {
    return new Promise((resolve) => {
        // const sql = strings.join('?')
        db.query(sql, data, (err, result, fields) => {
            if (err) {
                logger.error('数据库报错', err.message, err)
            }
            resolve([err, result as T, fields])
        })
    })
}

export const query = <T = any>(strings: TemplateStringsArray, ...data: any) => {
    const sql = strings.join('?')
    return rawQuery<T>(sql, data)
    // return new Promise((resolve) => {
    //   const sql = strings.join('?')
    //   db.query(sql, data, (err, result, fields) => {
    //     if (err) {
    //       logger.error('数据库报错', err)
    //     }
    //     resolve([err, result as T, fields])
    //   })
    // })
}
