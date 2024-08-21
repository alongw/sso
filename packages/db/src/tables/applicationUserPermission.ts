import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

export interface ApplicationUserPermissionTable {
    aupid: number
    appid: string
    apppid: number
}

export const ApplicationUserPermission = sequelize.define<
    Model<ApplicationUserPermissionTable>
>('ApplicationUserPermission', {
    aupid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    appid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    apppid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

export default ApplicationUserPermission
