const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

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
  devtool: 'none',
  entry: getEntries('./src/js/*.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    filename: 'js/[name].[chunkhash:8].min.js'
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
                minimize: true
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
                minimize: true
              }
            },
            'sass-loader',
            'postcss-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(`@Author: mixin
@Email: mixinsoft@163.com
@Date: ${new Date()}
版权所有，翻版必究`),
    new CleanWebpackPlugin('dist/*', {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('css/[name].[chunkhash:8].min.css')
  ]
};

const pages = getEntries('./src/view/*.html');
Object.keys(pages).forEach(name => {
  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    filename: name + '.html',
    template: pages[name],
    chunks: [name],
    inject: 'body',
    minify: {
      removeComments: true, // 移除HTML中的注释
      collapseWhitespace: false // 删除空白符与换行符
    }
  });

  config.plugins.push(htmlWebpackPlugin);
});

module.exports = config;
