import { Sequelize } from 'sequelize'
import { config } from '@nya-account/common'

const { db } = config

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: db.host,
    port: db.port,
    username: db.user,
    password: db.password,
    database: db.database,
    logging: false
})

export default sequelize

export * from './modules/bind'
