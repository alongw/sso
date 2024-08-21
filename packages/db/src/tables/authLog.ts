import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

import type { USER_UID_TYPE } from '@nya-account/common'

export interface AuthLogTable {
    id: number
    uid: USER_UID_TYPE
    appid: string
    ip: string
    time: number
    exp: number
    ua: string
    fingerprint: string
    use: boolean
}

export const AuthLog = sequelize.define<Model<AuthLogTable>>('AuthLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    appid: {
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
    exp: {
        type: DataTypes.DATE,
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
    use: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

export default AuthLog
