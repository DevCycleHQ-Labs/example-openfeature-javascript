const path = require('path')

module.exports = {
  extends: path.resolve(__dirname, './webpack.config.js'),
  mode: 'development',
  devServer: {
    open: true,
    port: 3000
  },
  output: {
    filename: 'main.js',
    publicPath: '/dist',
  }
}