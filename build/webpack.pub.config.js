const path = require('path')
// 导入每次删除文件夹的插件
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
// 导入抽取CSS的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 导入压缩CSS的插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, '../src/index.js'),
  devtool: 'cheap-module-source-map',
  output: {
    path: path.join(__dirname, '../lib'),
    filename: 'index.js',
    libraryTarget: 'umd', // 发布组件专用
    library: 'ReactCmp',
  },
  plugins: [ // 插件
    new CleanWebpackPlugin(['./lib']),
    new webpack.optimize.UglifyJsPlugin({
      compress: { // 配置压缩选项
        warnings: false, // 移除警告
      },
    }),
    new ExtractTextPlugin('styles.css'), // 抽取CSS文件
    new OptimizeCssAssetsPlugin(), // 压缩CSS的插件
  ],
  externals: {
    react: {
      amd: 'react',
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
    },
    'react-dom': {
      amd: 'react-dom',
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
    },
    echarts: {
      amd: 'echarts',
      root: 'echarts',
      commonjs: 'echarts',
      commonjs2: 'echarts',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]-[hash:base64:5]',
            },
          }],
          publicPath: '../',
        }),
      },
      {
        test: /\.css$/,
        exclude: [/src/],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{ loader: 'css-loader' }],
          publicPath: '../',
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]-[hash:base64:5]',
            },
          }, 'sass-loader'],
          publicPath: '../',
        }),
      },
      { test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader?limit=5000&name=images/[hash:8]-[name].[ext]' },
      { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader?limit=5000&name=images/[hash:8]-[name].[ext]' },
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
        include: [/src/, /node_modules\/react-draggable-tags/],
      },
    ],
  },
}
