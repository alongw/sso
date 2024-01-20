import fse from 'fs-extra'

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
