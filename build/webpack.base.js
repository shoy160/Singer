'use strict'
const path = require('path')

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        singer: './index.js'
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