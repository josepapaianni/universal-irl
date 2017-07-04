const { name } = require('../package.json');
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    vendor: [
      'react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'redux-thunk'
    ],
    app: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr&overlay=false',
      'webpack/hot/only-dev-server',
      './client/index.js'
    ],
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
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'BROWSER': true
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    })
  ]
};
