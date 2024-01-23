import { Sequelize, DataTypes } from 'sequelize'
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

export const System = sequelize.define('System', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export const Config = sequelize.define('Config', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
})
