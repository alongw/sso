import fs from 'fs'
import yaml from 'yaml'

import { DbConfigType } from '../types/config.js'
import logger from './log.js'

try {
    logger.info('尝试读取本地配置文件 ./config.yaml')
    fs.readFileSync('./config.yaml', 'utf8')
} catch (error) {
    logger.warn('读取失败，尝试创建默认配置文件')
    try {
        const defaultConfig = fs.readFileSync('./template/_config.yaml', 'utf8')
        fs.writeFileSync('./config.yaml', defaultConfig, 'utf8')
        logger.info('默认配置文件创建成功，请修改配置文件后重启服务')
        process.exit()
    } catch (error) {
        logger.error('默认配置文件创建失败，请手动创建并修改配置文件后重启服务')
        process.exit()
    }
}

// 本地配置文件（数据库信息配置）
export const dbConfig = yaml.parse(
    fs.readFileSync('./config.yaml', 'utf8')
) as DbConfigType
