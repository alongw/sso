// 为解决旧版文件引用问题，暂时保留此文件
// 此后将逐步删除此文件，禁止引用此文件。新数据请直接使用数据库存储（数据库同步配置文件中的数据）

import fse from 'fs-extra'
import { System, Config } from './../database/table'

interface PackageFile {
    key: string
    version: string
    description: string
    main: string
    repository: string
    author: string
    lisence: string
    type: string
    scripts: {
        [key: string]: string
    }
    devDependencies: {
        [key: string]: string
    }
    dependencies: {
        [key: string]: string
    }
    lintStaged: {
        [key: string]: string
    }
}

const packageFile: PackageFile = fse.readJsonSync('./package.json')

export const getSystemVersion = () => {
    return packageFile.version
}

export const getDatabaseVersion = async () => {
    const [version] = await System.findOrCreate({
        where: {
            key: 'version'
        },
        defaults: {
            value: packageFile.version
        }
    })
    return version.toJSON().value as string
}

// 以下为旧版配置文件，新数据请直接使用数据库存储（数据库同步配置文件中的数据）
// 禁止再引用此文件

export const getListenPort = async () => {
    const [listenPort] = await Config.findOrCreate({
        where: {
            key: 'listenPort'
        },
        defaults: {
            value: '10086'
        }
    })
    return Number(listenPort.toJSON().value)
}

export const getBaseUrl = async () => {
    const [baseUrl] = await Config.findOrCreate({
        where: {
            key: 'baseUrl'
        },
        defaults: {
            value: '/api'
        }
    })
    return baseUrl.toJSON().value as string
}

export const getJwtSecret = async () => {
    const [jwtSecret] = await Config.findOrCreate({
        where: {
            key: 'jwtSecret'
        },
        defaults: {
            value: '5dff9c5505ddef573d555880a253eb9b'
        }
    })
    return jwtSecret.toJSON().value as string
}

export const getCodeSecret = async () => {
    const [jwtSecret] = await Config.findOrCreate({
        where: {
            key: 'codeSecret'
        },
        defaults: {
            value: '5dff9c5505ddef573d555880a253eb9b'
        }
    })
    return jwtSecret.toJSON().value as string
}

export const getJwtUnless = async () => {
    const [jwtUnless] = await Config.findOrCreate({
        where: {
            key: 'jwtUnless'
        },
        defaults: {
            value: JSON.stringify([
                '/public',
                '/user/login',
                '/user/register',
                '/user/getAccountStatus',
                '/token'
            ])
        }
    })
    return JSON.parse(jwtUnless.toJSON().value) as string[]
}

export const getMail = async () => {
    const [mail] = await Config.findOrCreate({
        where: {
            key: 'mail'
        },
        defaults: {
            value: JSON.stringify({
                host: 'smtp.lolinya.net',
                port: 114514,
                secure: true,
                from: 'support<support@lolinya.net>',
                auth: {
                    user: '911@wh.gov',
                    pass: 'admin123'
                },
                adminMail: 'admin@lolinya.net'
            })
        }
    })
    return JSON.parse(mail.toJSON().value) as {
        host: string
        port: number
        secure: boolean
        from: string
        auth: {
            user: string
            pass: string
        }
        adminMail: string
    }
}
