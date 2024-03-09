import fse from 'fs-extra'
import yaml from 'yaml'
import logger from './log'

const defaultConfig = {
    db: {
        sync: false,
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'auth'
    }
}

try {
    fse.accessSync('./config.yaml')
} catch (err) {
    fse.writeFileSync('./config.yaml', yaml.stringify(defaultConfig))
    logger.warn('未找到配置文件，已自动创建，请修改配置文件后重启服务')
    process.exit(0)
}

const config: typeof defaultConfig = yaml.parse(fse.readFileSync('./config.yaml', 'utf8'))

export default config
