import fse from 'fs-extra'
import yaml from 'yaml'
import logger from './logger'

const defaultConfig = {
    db: {
        sync: false,
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'auth'
    },
    config: {
        app: {
            service: {
                port: 10086,
                baseUrl: '/api'
            }
        }
    }
}

if (!fse.existsSync('./config.yaml')) {
    fse.writeFileSync('./config.yaml', yaml.stringify(defaultConfig))
    logger.warn('未找到配置文件，已自动创建')
    process.exit(0)
}

const config = yaml.parse(
    fse.readFileSync('./config.yaml', 'utf8')
) as typeof defaultConfig

export default config
