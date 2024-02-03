import fse from 'fs-extra'
import yaml from 'yaml'
import logger from './log'

import type { Config } from '../types/config'

try {
    fse.accessSync('./config.yaml')
} catch (err) {
    fse.copySync('./template/_config.yaml', './config.yaml')
    logger.warn('未找到配置文件，已自动创建，请修改配置文件后重启服务')
    process.exit(0)
}

const config: Config = yaml.parse(fse.readFileSync('./config.yaml', 'utf8'))

export default config
