/* eslint-disable @typescript-eslint/no-unused-vars */
import { query } from './db.js'

import { Config } from '../types/config.js'

// 远程配置文件
export const getConfig = async <T extends keyof Config, K extends keyof Config[T]>(
    type: T,
    key: K
): Promise<Config[T][K]> => {
    // 数据库配置
    const [err, result] = await query`
    select * from config where \`key\`=${`${type}.${key.toString()}`};
    `
    if (result.length > 0) {
        return JSON.parse(result.at(-1).value)
    }
}

export const setConfig = async <T extends keyof Config, K extends keyof Config[T]>(
    type: T,
    key: K,
    value: Config[T][K],
    editor: string
) => {
    const configName = `${type}.${String(key)}`

    const [err, result] = await query`
        select * from config where key=${configName};
      `
    if (err) {
        return false
    }
    // 没有此项配置 需要新增
    if (result.length < 1) {
        const [err] = await query`
        insert into config set ${{
            key: configName,
            value: JSON.stringify(value),
            update: Date.now(),
            editor: JSON.stringify(editor)
        }}
        `
        if (err) {
            return false
        }
    } else {
        // 有此项配置 修改
        const [err] = await query`
        update config set ${{
            value: JSON.stringify(value),
            update: new Date(),
            editor: JSON.stringify(editor)
        }} where key=${configName};
        `
        if (err) {
            return false
        }
    }
    return true
}
