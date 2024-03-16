import jwt from 'jsonwebtoken'
import { getNodeSecret } from './system'
import { User } from '../types/request'
import { Config } from '@/database/table'
import { encrypt } from '@/utils/crypt'

const jwtSecretKey = await getNodeSecret()

const tokenSecret = await Config.findOne({
    where: {
        key: 'nodeTokenSecret'
    }
})

export default (data: User, expiresIn: number) => {
    // 需要在客户端拼接 Bearer 的前缀
    return jwt.sign(
        {
            secret: encrypt(JSON.stringify(data), tokenSecret.toJSON().value)
        },
        jwtSecretKey,
        {
            // expiresIn: '10h' // token 有效期为 10 个小时
            // 这里单位是秒 不是毫秒！
            // 直接用 1d 表示1天
            expiresIn
        }
    )
}
