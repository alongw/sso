import { Group, Permission, ApplicationPermission } from './table'

import { defaultPermissions } from '@/permission/permission'

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

// userPermissionList
for (const e of defaultPermissions) {
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
