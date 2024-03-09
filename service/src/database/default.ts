import { Group, Permission } from './table'

import { defaultPermissions } from '@/permission/permission'

await Group.findOrCreate({
    where: {
        gid: 1
    },
    defaults: {
        gid: 1,
        name: 'default'
    }
})

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
