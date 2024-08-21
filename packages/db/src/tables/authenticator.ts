import { DataTypes, Model } from 'sequelize'
import sequelize from '../index'

import type {
    // AuthenticatorTransportFuture,
    CredentialDeviceType
} from '@simplewebauthn/types'

export interface AuthenticatorTable {
    id: number // 身份验证器的唯一标识符
    // SQL: Encode to base64url then store as `TEXT`. Index this column
    credentialID: string // 凭据的唯一标识符 Uint8Array
    // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
    credentialPublicKey: string // 公钥字节，用于后续身份验证签名验证 Uint8Array
    // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
    counter: number // 到目前为止，身份验证器在本网站上被使用的次数
    // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
    // Ex: 'singleDevice' | 'multiDevice'
    credentialDeviceType: CredentialDeviceType // 身份验证器的类型
    // SQL: `BOOL` or whatever similar type is supported
    credentialBackedUp: boolean // 身份验证器是否已备份
    // SQL: `VARCHAR(255)` and store string array as a CSV string
    // Ex: ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']
    // transports?: AuthenticatorTransportFuture[] // 身份验证器的传输方式
    transports?: string // 身份验证器的传输方式
    owner: string // 身份验证器的所有者
    name: string // 身份验证器的名称
}

export const Authenticator = sequelize.define<Model<AuthenticatorTable>>(
    'Authenticator',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        credentialID: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        credentialPublicKey: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        counter: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        credentialDeviceType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        credentialBackedUp: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        transports: {
            type: DataTypes.STRING,
            allowNull: true
        },
        owner: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

export default Authenticator
