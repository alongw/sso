import { Application, type ApplicationTable } from './../tables/application'
import {
    ApplicationPermission,
    type ApplicationPermissionTable
} from './../tables/applicationPermission'
import {
    ApplicationUserPermission,
    type ApplicationUserPermissionTable
} from './../tables/applicationUserPermission'
import { AuthLog, type AuthLogTable } from './../tables/authLog'
import { Authenticator, type AuthenticatorTable } from './../tables/authenticator'
import {
    AuthenticatorOptions,
    type AuthenticatorOptionsTable
} from './../tables/authenticatorOptions'
import { Config, type ConfigTable } from './../tables/config'
import { EmailCode, type EmailCodeTable } from './../tables/emailCode'
import { Group, type GroupTable } from './../tables/group'
import { GroupPermission, type GroupPermissionTable } from './../tables/groupPermission'
import { LoginLog, type LoginLogTable } from './../tables/loginLog'
import { Permission, type PermissionTable } from './../tables/permission'
import { System, type SystemTable } from './../tables/system'
import { User, type UserTable } from './../tables/user'

User.hasMany(Authenticator, {
    foreignKey: 'owner',
    as: 'authenticators'
})

Authenticator.belongsTo(User, {
    foreignKey: 'owner'
})

Group.belongsToMany(Permission, {
    through: {
        model: GroupPermission,
        unique: false
    }
})

Permission.belongsToMany(Group, {
    through: {
        model: GroupPermission,
        unique: false
    }
})

Application.belongsToMany(ApplicationPermission, {
    through: ApplicationUserPermission,
    as: 'permissionList',
    foreignKey: 'appid',
    otherKey: 'apppid'
})

ApplicationPermission.belongsToMany(Application, {
    through: ApplicationUserPermission,
    as: 'applicationList',
    foreignKey: 'apppid',
    otherKey: 'appid'
})

User.hasMany(Application, {
    foreignKey: 'owner',
    as: 'application'
})

Application.belongsTo(User, {
    foreignKey: 'owner',
    as: 'ownerInfo'
})

Group.hasMany(User, {
    foreignKey: 'group',
    as: 'user'
})

User.belongsTo(Group, {
    foreignKey: 'group',
    as: 'userGroup'
})

export {
    Application,
    ApplicationTable,
    ApplicationPermission,
    ApplicationPermissionTable,
    ApplicationUserPermission,
    ApplicationUserPermissionTable,
    AuthLog,
    AuthLogTable,
    Authenticator,
    AuthenticatorTable,
    AuthenticatorOptions,
    AuthenticatorOptionsTable,
    Config,
    ConfigTable,
    EmailCode,
    EmailCodeTable,
    Group,
    GroupTable,
    GroupPermission,
    GroupPermissionTable,
    LoginLog,
    LoginLogTable,
    Permission,
    PermissionTable,
    System,
    SystemTable,
    User,
    UserTable
}
