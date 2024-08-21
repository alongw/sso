import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

export interface EmailCodeTable {
    id: number
    code: string
    email: string
    ip: string
    expire: number
    sendTime: number
    used: boolean
    useTime: number
    type: string
}

export const EmailCode = sequelize.define<Model<EmailCodeTable>>('EmailCode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sendTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    expire: {
        type: DataTypes.DATE,
        allowNull: false
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    useTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

export default EmailCode
