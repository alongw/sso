import crypto from 'crypto'

export default (data: string) => {
    return crypto.createHash('md5').update(data).digest('hex')
}
