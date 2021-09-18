const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
// 入口文件
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js",
        publicPath: '/'
    },
    devServer: {
        inline: true, //实时刷新
        hot: true, // 模块热替换机制
        host: 'localhost', //设置服务器的主机号
        port: 9001,
        compress: true,
        open: false, // 打开浏览器，默认false
        proxy: {
            '/admin': {
                target: `http://192.168.9.100:6680`,
                changeOrigin: true,
            }
        },
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS
                }, {
                    loader: 'less-loader', // compiles Less to CSS
                    options: {
                        lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                            modifyVars: {
                                'primary-color': '#2e3fb0',
                                'link-color': '#2e3fb0',
                                'border-radius-base': '5px',
                                'border-color-base': '#9face0',
                                'box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),  0 9px 28px 8px rgba(0, 0, 0, 0.05)'
                            },
                            javascriptEnabled: true,
                        }
                    }
                }]
            },
            {
                // 解析jsx文件类型
                test: /\.jsx?$/,
                //
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env", "@babel/react"]
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
                            name: 'assets/images/[name].[hash:8].[ext]',
                            publicPath: ''
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

    plugins: [
        new HtmlWebpackPlugin({ //打包输出HTML
            filename: 'index.html',
            template: 'index.html',
            favicon: path.resolve('./favicon.ico')
        }),
        // new webpack.HotModuleReplacementPlugin()
    ],
    devtool: "source-map", // 开启调试
    mode: "development"
}
