import { checkPermission } from './permission.js'

import { menus } from './../data/menu.js'

import type { Menu } from './../types/menu.js'

// 检查用户权限
export const getMenu = async (user: number) => {
    const menu: Menu[] = []

    await Promise.all(
        menus.map(async (e) => {
            const auth = await checkPermission(e.permission, user)
            if (auth) {
                menu.push(e)
            }
        })
    )

    // 排序选项
    menu.sort((a, b) => a.priority - b.priority)

    return menu
}
