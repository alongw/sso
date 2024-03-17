import { Group, Permission, ApplicationPermission, Config } from './table'

import {
    defaultPermissions,
    type Permission as PermissionType
} from '@/permission/permission'

import { defaultAppPermission } from '@/permission/applitcation'

await Group.findOrCreate({
    where: {
        gid: 1
    },
    defaults: {
        gid: 1,
        name: 'default'
    }
})

await Config.findOrCreate({
    where: {
        key: 'uuidV5Key'
    },
    defaults: {
        key: 'uuidV5Key',
        value: '6bad7a6ac49cc8b4e50e2b76d37f0841'
    }
})

await Config.findOrCreate({
    where: {
        key: 'nodeTokenSecret'
    },
    defaults: {
        key: 'nodeTokenSecret',
        value: '6b9ebf1fe871a1c15bdc45961d32aef0'
    }
})

// userPermissionList
for (const e of defaultPermissions as unknown as PermissionType[]) {
    await Permission.findOrCreate({
        where: {
            pid: e.pid
        },
        defaults: {
            pid: e.pid,
            name: e.name,
            parent: e.parent,
            description: e.desc
        }
    })
}

// applicationPermissionList
for (const e of defaultAppPermission) {
    await ApplicationPermission.findOrCreate({
        where: {
            apppid: e.apppid
        },
        defaults: {
            apppid: e.apppid,
            name: e.name,
            description: e.description,
            typeRequire: e.typeRequire,
            defaultCheck: e.defaultCheck,
            lock: e.lock,
            priority: e.priority
        }
    })
}
