const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.base.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    }
})
