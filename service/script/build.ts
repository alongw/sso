import shell from 'shelljs'

// 检测并创建目录，如果目录不存在
const createDirectoryIfNotExists = (dirPath: string) => {
    if (!shell.test('-d', dirPath)) {
        shell.mkdir('-p', dirPath)
    }
}

// 删除目录下的所有内容，保留目录本身
const deleteFolderContents = (folderPath: string) => {
    if (shell.test('-d', folderPath)) {
        shell.rm('-rf', `${folderPath}/*`)
    }
}

// 复制整个文件夹
const copyFolder = (source: string, destination: string) => {
    if (shell.test('-e', source)) {
        createDirectoryIfNotExists(destination) // 确保目标目录存在
        shell.cp('-R', `${source}/.`, destination) // 复制整个文件夹
    }
}

// 复制文件夹中的文件
// const copyFolderFiles = (source: string, destination: string) => {
//     if (shell.test('-d', source)) {
//         createDirectoryIfNotExists(destination) // 确保目标目录存在
//         shell.cp('-R', `${source}/*`, destination) // 仅复制文件夹中的文件
//     }
// }

// 删除 dist/out 目录内容
deleteFolderContents('dist')

// 检测并创建 dist 目录
createDirectoryIfNotExists('dist')

// 编译 TypeScript 文件
shell.exec('tsc')

// 复制 public 文件夹到 dist/ncc 目录（包括文件夹本身）
copyFolder('public', 'dist/public')

// 复制 src/public 文件夹到 dist/out 目录（包括文件夹本身）
copyFolder('src/public', 'dist/public')

// 复制 template 文件夹到 dist/out/template 目录（包括文件夹本身）
copyFolder('template', 'dist/template')

// 复制 package.json 和 yarn.lock 和 LICENSE 文件到 dist/out 目录
shell.cp('package.json', 'dist/package.json')
shell.cp('yarn.lock', 'dist/yarn.lock')
shell.cp('LICENSE', 'dist/LICENSE')

console.log('成功构建')
