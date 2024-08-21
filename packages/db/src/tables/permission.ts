import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

export interface PermissionTable {
    pid: number
    name: string
    description: string
    parent: number
}

export const Permission = sequelize.define<Model<PermissionTable>>('Permission', {
    pid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    parent: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

export default Permission
