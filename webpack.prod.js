var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var commonCss = new ExtractTextPlugin('common.css');
var bundleCss = new ExtractTextPlugin('style.css');

var watcher = require('./config.json').watcher

module.exports = {
    entry: {
        main: ['whatwg-fetch', watcher],
        vendor: ['whatwg-fetch', 'react', 'react-dom', 'react-router', 'redux', 'react-redux']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../frontend-build')
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    plugins: ['transform-object-rest-spread', ['import', {
                        libraryName: 'antd',
                        style: 'css'
                    }]],
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.less$/,
                loader: bundleCss.extract(['css?minimize', 'postcss', 'less'])
            },
            {
                test: /\.css$/,
                loader: commonCss.extract(['css?minimize', 'postcss'])
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)([\?]?.*)$/,
                loader: 'file?name=[name].[ext]'
            }
        ]
    },
    postcss: [autoprefixer],
    plugins: [
        new webpack.DefinePlugin({
            //__DEV__: true
            __DEV__: false,
            'process.env': { NODE_ENV: JSON.stringify('production') }
        }),
        new webpack.optimize.CommonsChunkPlugin('common.js', ['main', 'vendor']),
        new HtmlWebpackPlugin({
            template: './src/tmpl.html'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        commonCss,
        bundleCss
    ],
    resolve: {
        //root: path.resolve(__dirname, 'src/js'),
        extensions: ['', '.jsx', '.less', '.js', '.json'],
        alias: {
            //'react': 'react-lite',
            //'react-dom': 'react-lite'
            'draft-js': path.resolve(__dirname, 'src/js/lib/draft/Draft'),
            'draft-js-origin': 'draft-js'
        }
    }
};
