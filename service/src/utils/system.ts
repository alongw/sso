import fse from 'fs-extra'
import { System, Config } from './sql'

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

export const getListenPort = async () => {
    const [listenPort] = await Config.findOrCreate({
        where: {
            key: 'listenPort'
        },
        defaults: {
            value: 10086
        }
    })
    return listenPort.toJSON().value as number
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

export const getJwtUnless = async () => {
    const [jwtUnless] = await Config.findOrCreate({
        where: {
            key: 'jwtUnless'
        },
        defaults: {
            value: JSON.stringify(['/public', '/user/login', '/user/register'])
        }
    })
    return JSON.parse(jwtUnless.toJSON().value) as string[]
}
