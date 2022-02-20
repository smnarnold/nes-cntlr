const path = require('path');

module.exports = {
  target: 'web',
  entry: './src/nes-cntlr.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'nes-cntlr.js',
    globalObject: 'this',
    library: {
      name: 'NESCntlr',
      type: 'umd',
      export: 'default',
      umdNamedDefine: true,
    }
  }
};