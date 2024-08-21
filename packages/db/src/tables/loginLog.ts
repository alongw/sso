import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

import type { USER_LOGIN_TYPE, USER_UID_TYPE } from '@nya-account/common'

export interface LoginLogTable {
    id: number
    uid: USER_UID_TYPE
    ip: string
    time: number
    type: USER_LOGIN_TYPE
    captcha: boolean
    ua: string
    fingerprint: string
    result: boolean
}

export const LoginLog = sequelize.define<Model<LoginLogTable>>('LoginLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    captcha: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ua: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fingerprint: {
        type: DataTypes.STRING,
        allowNull: false
    },
    result: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

export default LoginLog
