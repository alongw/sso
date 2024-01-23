import fse from 'fs-extra'
import { System } from './sql'

interface PackageFile {
    name: string
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
            name: 'version'
        },
        defaults: {
            value: packageFile.version
        }
    })
    return version.toJSON().value
}
