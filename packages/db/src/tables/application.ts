import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

export interface ApplicationTable {
    appid: string
    name: string
    description: string
    secret: string
    status: number
    owner: string
    redirect: string
    approve: number
}

export const Application = sequelize.define<Model<ApplicationTable>>('Application', {
    appid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    secret: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    owner: {
        type: DataTypes.UUID,
        allowNull: false
    },
    redirect: {
        type: DataTypes.STRING,
        allowNull: false
    },
    approve: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
})

export default Application
