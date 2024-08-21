import { DataTypes, Model } from 'sequelize'
import sequelize from './../index'

export interface SystemTable {
    id: number
    key: string
    value: string
}

export const System = sequelize.define<Model<SystemTable>>('System', {
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

export default System
