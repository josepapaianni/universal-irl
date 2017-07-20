const { name } = require('../package.json');
const { resolve } = require('path');
const webpack = require('webpack');


module.exports = {
  devtool: 'source-map',
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
    path: resolve() + '/public/',
    filename: '[name].js',
    publicPath: '/'
  }
};
