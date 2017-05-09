var webpack = require('webpack')
var path = require('path')
var autoprefixer = require('autoprefixer')

var watcher = require('./config.json').watcher

module.exports = {
    entry: {
        main: ['webpack-dev-server/client?http://127.0.0.1:8000', watcher],
        vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux', 'whatwg-fetch', 'slate']
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
                loader: 'style!css!postcss!less'
            },
            {
                test: /\.css$/,
                loader: 'style!css!postcss'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)([\?]?.*)$/,
                loader: 'file'
            },
            {   test: /\.(gif|jpg|png)\??.*$/,
                loader: 'url-loader'
            }
        ]
    },
    postcss: [autoprefixer],
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js', ['main', 'vendor']),
        new webpack.DefinePlugin({ __DEV__: true })
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
