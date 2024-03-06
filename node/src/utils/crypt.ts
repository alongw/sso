import crypto from 'crypto'

import { getCodeSecret } from './system'

const codeSecret = await getCodeSecret()

// 加密算法的名称
const algorithm = 'aes-256-cbc'

// 分隔符
const separator = 'nya❤account♡Chino♥daisuki'

// 加密函数，接受一个要加密的字符串和一个加密密钥，返回加密后的字符串
function encrypt(text: string, key: string = codeSecret): string {
    // 生成一个随机的 16 字节的初始向量
    const iv = crypto.randomBytes(16)
    // 创建一个加密器，使用 AES-256-CBC 对称加密算法和输入的密钥
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
    // 对输入的字符串进行加密
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    // 返回初始向量和加密后的数据的十六进制格式，中间用奇怪的符号分隔
    return `${iv.toString('hex')}${separator}${encrypted.toString('hex')}`
}

// 解密函数，接受一个加密后的字符串和一个解密密钥，返回解密后的字符串
function decrypt(text: string, key: string = codeSecret): string {
    // 将输入的字符串解析为初始向量和加密后的数据，它们之间用奇怪的符号分隔
    const [ivHex, encryptedHex] = text.split(separator)
    const iv = Buffer.from(ivHex, 'hex')
    const encrypted = Buffer.from(encryptedHex, 'hex')
    // 创建一个解密器，使用 AES-256-CBC 对称加密算法和输入的密钥
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
    // 对加密后的数据进行解密
    let decrypted = decipher.update(encrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    // 返回解密后的字符串
    return decrypted.toString()
}

// 导出加密和解密函数
export { encrypt, decrypt }
