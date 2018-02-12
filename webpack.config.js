// webpack.config.js
const webpack = require('webpack')
const path = require('path')

const config = {
  context: path.resolve(__dirname, 'nes'),
  entry: {
    'cntlr': './cntlr.dev.js',
    'cntlr.min': './cntlr.dev.js',
  },
  output: {
    path: path.resolve(__dirname, 'nes'),
    filename: "[name].js"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve(__dirname, 'nes'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        }
      }]
    }]
  }
}

module.exports = config