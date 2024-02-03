import { DataTypes, Model } from 'sequelize'

import sequelize from './../utils/db.js'

import type {
    ApplicationTable,
    ConfigTable,
    GroupTable,
    GroupPermissionTable,
    PermissionTable,
    SystemTable,
    UserTable,
    EmailCodeTable,
    ApplicationPermissionTable,
    ApplicationUserPermissionTable,
    LoginLogTable,
    AuthLogTable
} from './../types/table.js'

export const System = sequelize.define<Model<SystemTable>>('System', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export const Config = sequelize.define<Model<ConfigTable>>('Config', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

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
    }
})

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
    }
})

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

export const Permission = sequelize.define<Model<PermissionTable>>('Permission', {
    pid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    parent: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

export const GroupPermission = sequelize.define<Model<GroupPermissionTable>>(
    'GroupPermission',
    {
        gpid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        gid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        specialValue: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        allow: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }
)

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

export const ApplicationPermission = sequelize.define<Model<ApplicationPermissionTable>>(
    'ApplicationPermission',
    {
        apppid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        typeRequire: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        defaultCheck: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        lock: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
)

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
    sourceKey: 'uid',
    foreignKey: 'owner',
    as: 'application'
})

Application.belongsTo(User, {
    foreignKey: 'owner',
    as: 'ownerInfo'
})

Group.hasMany(User, {
    sourceKey: 'gid',
    foreignKey: 'group',
    as: 'user'
})

User.belongsTo(Group, {
    foreignKey: 'group',
    as: 'userGroup'
})
