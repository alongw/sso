import jwt from 'jsonwebtoken'
import { getConfig } from './config.js'
import { User } from '../types/express.js'

const jwtSecretKey = await getConfig('jwt', 'secret')
const expiresIn = await getConfig('jwt', 'expires')

export default (data: User) => {
    // 需要在客户端拼接 Bearer 的前缀
    return jwt.sign(data, jwtSecretKey, {
        // expiresIn: '10h' // token 有效期为 10 个小时
        // 这里单位是秒 不是毫秒！
        // 直接用 1d 表示1天
        expiresIn
    })
}
