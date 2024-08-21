import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

import type { USER_UID_TYPE } from '@nya-account/common'

export interface UserTable {
    uid: USER_UID_TYPE
    username: string
    password: string
    email: string
    public_email: string
    status: number
    nickname: string
    group: number
}

export const User = sequelize.define<Model<UserTable>>('User', {
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    public_email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    group: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

export default User
