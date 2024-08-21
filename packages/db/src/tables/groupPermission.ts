import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

export interface GroupPermissionTable {
    gpid: number
    gid: number
    pid: number
    specialValue: number
    allow: boolean
}

export const GroupPermission = sequelize.define<Model<GroupPermissionTable>>(
    'GroupPermission',
    {
        gpid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        gid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        specialValue: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        allow: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }
)

export default GroupPermission
