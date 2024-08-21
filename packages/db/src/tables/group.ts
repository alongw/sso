import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

export interface GroupTable {
    gid: number
    name: string
}

export const Group = sequelize.define<Model<GroupTable>>('Group', {
    gid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Group
