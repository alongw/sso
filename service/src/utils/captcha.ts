import axios, { AxiosResponse } from 'axios'
import logger from './log.js'

export async function checkTicket(
    ticket: string,
    randstr: string
): Promise<{
    status: number
    msg: string
}> {
    try {
        const response: AxiosResponse = await axios.get(
            `https://cgi.urlsec.qq.com/index.php?m=check&a=gw_check&callback=url_query&url=https%3A%2F%2Fwww.qq.com%2F${Math.floor(
                Math.random() * (999999 - 111111 + 1) + 111111
            )}&ticket=${encodeURIComponent(ticket)}&randstr=${encodeURIComponent(
                randstr
            )}`,
            {
                headers: {
                    Accept: 'application/json',
                    'Accept-Language': 'zh-CN,zh;q=0.8',
                    Connection: 'close',
                    Referer: 'https://urlsec.qq.com/check.html',
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
                }
            }
        )

        const arr = jsonpDecode<{
            reCode: number
            data: string
        }>(response.data)

        if (arr.reCode === 0) {
            logger.info(`验证码鉴权 randstr ${randstr} 通过`)
            return {
                status: 200,
                msg: arr.data
            }
        }

        logger.info(
            `验证码鉴权 randstr ${randstr} 失败 系统返回 ${arr.toString()} ${arr.data}`
        )

        return {
            status: arr.reCode,
            msg: arr.data
        }
    } catch (error) {
        return {
            status: 500,
            msg: '服务器错误'
        }
    }
}

const jsonpDecode = <T>(jsonp: string): T => {
    jsonp = jsonp.trim()
    let begin = 0
    let end = 0

    if (jsonp[0] !== '[' && jsonp[0] !== '{') {
        begin = jsonp.indexOf('(')
        if (begin !== -1) {
            end = jsonp.lastIndexOf(')')
            if (end !== -1) {
                jsonp = jsonp.substring(begin + 1, end)
            }
        }
    }

    return JSON.parse(jsonp)
}
