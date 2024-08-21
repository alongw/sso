import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

export interface ConfigTable {
    id: number
    key: string
    value: string
}

export const Config = sequelize.define<Model<ConfigTable>>('Config', {
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

export default Config
