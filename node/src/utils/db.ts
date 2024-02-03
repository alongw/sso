import { Sequelize } from 'sequelize'
import { dbLogger } from './log'
import config from './config'

const { db } = config

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: db.host,
    port: db.port,
    username: db.user,
    password: db.password,
    database: db.database,
    logging: (msg) => dbLogger.debug.bind(msg)
})

export default sequelize
