const { name } = require('../package.json');
const { resolve } = require('path');
const fs = require('fs');
const webpack = require('webpack');

module.exports = {
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
    path: resolve() + '/build/',
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: true,
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    }),
    function getBuildStats() {
      this.plugin('done', (stats) => {
        const assets = JSON.stringify({assetsByChunkName: stats.toJson().assetsByChunkName, entrypoints: stats.toJson().entrypoints});
        fs.writeFileSync(`${resolve()}/build/stats.json`, assets)
      });
    },
  ]
};
