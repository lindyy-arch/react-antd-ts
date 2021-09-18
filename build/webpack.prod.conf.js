const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  // 入口文件
  entry: './app.js',
  output: {
    // path: __dirname + "/dist",
    path: path.resolve(__dirname, '../dist'),
    // filename: "bundle.js"
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js'
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  module: {
    rules: [
      {
        // 解析jsx文件类型
        test:/\.jsx?$/,
        //
        use:{
          loader:"babel-loader",
          options:{
            presets:["@babel/env","@babel/react"]
          }
        }
      },
      {
        test: /\.js$/, // 匹配.js文件
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      //配置sass
      {
        test: /\.s(a|c)ss$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        }],
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(png|jp?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,        // 小于8192字节的图片打包成base 64图片
              name:'assets/images/[name].[hash:8].[ext]',
              publicPath:''
            }
          }
        ]
      }
    ]
  },
  // 文件引用不需要后缀名 import xx from 'xxx'
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve('src'),
    }
  },
  devServer: {
    inline: true, //实时刷新
    host: '0.0.0.0', //设置服务器的主机
    port: 9000,
    compress: true,
    open: false, // 打开浏览器，默认false
    proxy: {
      '/': {
        target: `http://192.168.9.24:6680`,
        changeOrigin: true,
      }
    },
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({ //打包输出HTML
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: 'index.html',
      favicon: path.resolve('./favicon.ico')
    }),
    // new MiniCssExtractPlugin({
    //   filename: '[name].[contenthash].css',
    //   allChunks: true,
    // }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash].css",
      chunkFilename: "static/css/[id].[contenthash].css"
    }),
    new OptimizeCSSPlugin({}),
    new CleanWebpackPlugin()
    // new webpack.HotModuleReplacementPlugin()
  ],
  devtool: false, // 开启调试
  mode: "production",
}