import { readFile } from 'node:fs/promises'

interface Package {
    name: string
    version: string
    description?: string
    main: string
    repository?: string
    author?: string
    license?: string
    scripts?: ChildOption
    devDependencies?: ChildOption
    'lint-staged'?: ChildOption
    config?: ChildOption
    dependencies?: ChildOption
}
interface ChildOption {
    [name: string]: string
}

export const getPackage = async (): Promise<Package> => {
    const packageFile = await readFile('./package.json', 'utf-8')
    return JSON.parse(packageFile)
}
