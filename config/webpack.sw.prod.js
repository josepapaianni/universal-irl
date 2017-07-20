const { name } = require('../package.json');
const { resolve } = require('path');
const webpack = require('webpack');


module.exports = {
  entry: {
    sw: [
      './client/sw.js'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  },
  output: {
    path: resolve() + '/build/',
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    })
  ]
};
