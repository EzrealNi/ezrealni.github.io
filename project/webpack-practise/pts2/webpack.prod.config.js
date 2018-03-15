const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const glob = require('glob');

// 获取指定路径下的入口文件
function getEntries(globPath) {
  const files = glob.sync(globPath);
  const entries = {};

  for (var i = 0; i < files.length; i++) {
    const entry = files[i];
    const extname = path.extname(entry);
    const basename = path.basename(entry, extname);
    entries[basename] = entry;
  }
  return entries;
}

const config = {
  // entry: getEntries('./src/js/*.js'),
  entry: getEntries('./src/components/vCharts/*.js'),
  output: {
    // library: 'vcharts',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    // filename: 'js/[name].[chunkhash:8].min.js'
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /(\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        },
        exclude: path.resolve(__dirname, './node_modules')
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                // minimize: true
              }
            },
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                // minimize: true
              }
            },
            'sass-loader',
            'postcss-loader'
          ]
        })
      }
    ]
  },
  externals: {
    d3: 'd3',
    $: '$',
    jquery: 'jquery'
  },
  plugins: [
    //     new webpack.BannerPlugin(`@Author: mixin
    // @Email: mixinsoft@163.com
    // @Date: ${new Date()}
    // 版权所有，翻版必究`),
    new CleanWebpackPlugin('dist/*', {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify('production')
    // }),
    // new LodashModuleReplacementPlugin({
    //   path: true,
    //   flattening: true
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor'
    //   // filename: 'vendor.js',
    //   // (给 chunk 一个不同的名字)
    //   // minChunks: Infinity
    //   // (随着 entry chunk 越来越多，
    //   // 这个配置保证没其它的模块会打包进 vendor chunk)
    // }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.MinChunkSizePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    // new ExtractTextPlugin('css/[name].[chunkhash:8].min.css')
    new ExtractTextPlugin('css/[name].css')
  ]
};

// const pages = getEntries('./src/view/*.html');
// Object.keys(pages).forEach(name => {
//   const htmlWebpackPlugin = new HtmlWebpackPlugin({
//     filename: name + '.html',
//     template: pages[name],
//     chunks: [name],
//     inject: 'body',
//     minify: {
//       removeComments: true, // 移除HTML中的注释
//       collapseWhitespace: false // 删除空白符与换行符
//     }
//   });

//   config.plugins.push(htmlWebpackPlugin);
// });

module.exports = config;
