const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, '../example/main.js'),
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  plugins: [ // 插件
    new htmlWebpackPlugin({
      template: path.join(__dirname, '../example/index.html'),
      filename: 'index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]-[hash:base64:5]'
          }
        }]
      },
      {test: /\.scss$/, use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]-[hash:base64:5]'
          }
        }, 'sass-loader']},
      {test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader?limit=5000'},
      {test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader?limit=5000'},
      {test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/}
    ]
  }
}
