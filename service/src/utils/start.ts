import logger from './log.js'
import app from './express.js'
import { getConfig } from './config.js'
import { checkUpdate } from './updateDb.js'

await checkUpdate()

const _port = await getConfig('app', 'listenPort')

app.use(await getConfig('app', 'baseUrl'), async (req, res, next) =>
    (await import('./../router/index.js')).default(req, res, next)
)

app.listen(_port, () => {
    logger.info(`nia-images 服务器正在端口 ${_port} 上运行`)
})
