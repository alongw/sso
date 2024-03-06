/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'production',
    // mode: 'development',
    entry: './src/app.ts',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs'
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: [
        nodeExternals(),
        (data, cb) => {
            const { request, context, getResolve } = data
            // 仅判断 node: 开头,可能会有问题,引入时需要node:fs
            if (request.indexOf('node:') == 0) {
                return cb()
            }
            getResolve()(context, request, (err, result) => {
                if (err) {
                    return cb()
                }
                if (result.includes('node_modules')) {
                    return cb(null, 'commonjs ' + request)
                }
                cb()
            })
        }
    ],
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './package.json',
                    to: path.resolve(__dirname, 'dist'),
                    transform: (content, path) => {
                        const json = JSON.parse(content.toString())
                        json.type = 'commonjs'
                        return JSON.stringify(json, null, 2)
                    }
                },
                {
                    from: './template',
                    to: path.resolve(__dirname, 'dist/template')
                }
            ]
        })
    ],
    optimization: {
        splitChunks: false
    },
    target: 'node'
}
