import jwt from 'jsonwebtoken'
import { getJwtSecret } from './system'
import { User } from '../types/request'

const jwtSecretKey = await getJwtSecret()

export default (data: User, expiresIn: number) => {
    // 需要在客户端拼接 Bearer 的前缀
    return jwt.sign(data, jwtSecretKey, {
        // expiresIn: '10h' // token 有效期为 10 个小时
        // 这里单位是秒 不是毫秒！
        // 直接用 1d 表示1天
        expiresIn
    })
}
