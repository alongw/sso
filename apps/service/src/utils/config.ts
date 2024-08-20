import fse from 'fs-extra'
import yaml from 'yaml'
import { Config, logger } from '@nya-account/common'

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

const config = new Config<typeof defaultConfig>()

if (!fse.existsSync('./config.yaml')) {
    fse.writeFileSync('./config.yaml', yaml.stringify(defaultConfig))
    logger.warn('未找到配置文件，已自动创建')
    process.exit(0)
}

config.set(yaml.parse(fse.readFileSync('./config.yaml', 'utf8')))

export default config
