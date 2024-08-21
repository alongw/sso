import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

export interface ApplicationPermissionTable {
    apppid: number
    name: string
    description: string
    typeRequire: number
    defaultCheck: boolean
    lock: boolean
    priority: number
}

export const ApplicationPermission = sequelize.define<Model<ApplicationPermissionTable>>(
    'ApplicationPermission',
    {
        apppid: {
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
        typeRequire: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        defaultCheck: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        lock: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
)

export default ApplicationPermission
