import fse from 'fs-extra'
import yaml from 'yaml'

import type { Config } from './../data/config'

const config: Config = yaml.parse(fse.readFileSync('./config.yaml', 'utf8'))

export default config
