// webpack.config.js
const webpack = require('webpack')
const path = require('path')

const config = {
  context: path.resolve(__dirname, 'src'),
  entry:  {
    'nes-cntlr': './nes-cntlr.js',
    'nes-cntlr.min': './nes-cntlr.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js",
    "library": "NESCntlr",
    "libraryTarget": "var"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      mangle: {
        except: ['NESCntlr']
      }
    })
  ],
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
