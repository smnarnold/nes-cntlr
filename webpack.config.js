// webpack.config.js
const webpack = require('webpack')
const path = require('path')

const config = {
  context: path.resolve(__dirname, 'src'),
  entry:  './index.js',
  output: {
    path: path.resolve(__dirname, ''),
    filename: "index.js"
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve(__dirname),
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