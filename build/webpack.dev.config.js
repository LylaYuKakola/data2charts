const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, '../example/main.js'),
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.join(__dirname, '../disHt'),
    filename: 'bundle.js',
  },
  plugins: [ // 插件
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../example/index.html'),
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]-[hash:base64:5]',
          },
        }],
      },
      {
        test: /\.css$/,
        exclude: [/src/],
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]-[hash:base64:5]',
          },
        }, 'sass-loader'],
      },
      { test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader?limit=5000' },
      { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader?limit=5000' },
      {
        test: /\.(jsx|js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.(jsx|js)$/,
        use: 'babel-loader',
        include: [/src/, /example/, /node_modules\/react-draggable-tags/],
      },
    ],
  },
}
