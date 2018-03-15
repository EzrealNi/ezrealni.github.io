const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  devtool: 'eval-source-map',
  entry: getEntries('./src/js/*.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    filename: 'js/[name].js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 9127,
    inline: true,
    hot: true,
    host: '0.0.0.0',
    disableHostCheck: true
  },
  module: {
    rules: [
      {
        test: /(\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-runtime']
          }
        },
        exclude: path.resolve(__dirname, './node_modules')
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ],
    noParse: /lodash|jquery|dash.all.min.js|ol-debug.js/
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};

const pages = getEntries('./src/view/*.html');
Object.keys(pages).forEach(name => {
  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    filename: name + '.html',
    template: pages[name],
    chunks: [name],
    inject: 'body'
  });

  config.plugins.push(htmlWebpackPlugin);
});

module.exports = config;
