import { Sequelize, DataTypes } from 'sequelize'
import { dbLogger } from './log'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/db.sqlite',
    logging: (msg) => dbLogger.debug.bind(msg)
})

export default sequelize

export const System = sequelize.define('System', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
})
