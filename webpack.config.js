'use strict'

const path = require('path');

module.exports = {
    context: path.resolve(__dirname, './'),
    entry: './index.js',
    output: {
        filename: 'singer.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env', {
                            targets: {
                                browsers: ['> 1%', 'last 2 versions']
                            }
                        }]
                    ]
                }
            },
            exclude: '/node_modules/'
        }]
    }
};