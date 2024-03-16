import { v5 as uuidv5 } from 'uuid'

import { Config } from '@/database/table'

let uuidV5Key: string

const getUuidV5Key = async () => {
    if (!uuidV5Key) {
        const result = await Config.findOne({
            where: {
                key: 'uuidV5Key'
            }
        })
        uuidV5Key = result.toJSON().value
    }
    return uuidV5Key
}

/*
 * 为不同的应用程序生成用户 uuid
 */
export const getUserIdByApplitcation = async (
    userId: string,
    appId: string
): Promise<string> => {
    const key = await getUuidV5Key()
    const name = `${key}-chino-daisuki-nya-${appId}`
    const uuid = uuidv5(name, userId)
    return uuid
}
