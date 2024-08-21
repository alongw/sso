import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

import type { USER_UID_TYPE } from '@nya-account/common'

export interface AuthenticatorOptionsTable {
    id: number
    uid: USER_UID_TYPE
    type: 'set' | 'use'
    options: string
    update_time: number
    used: boolean
}

export const AuthenticatorOptions = sequelize.define<Model<AuthenticatorOptionsTable>>(
    'AuthenticatorOptions',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        options: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        update_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }
)

export default AuthenticatorOptions
