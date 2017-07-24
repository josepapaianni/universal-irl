const { name } = require('../package.json');
const { resolve } = require('path');
const fs = require('fs');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: [
      './client/index.js'
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
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader?modules&localIdentName=[path][name]-[local]' },
        ],
      },
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
      name: "vendor",
      minChunks: function(module){
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    function getBuildStats() {
      this.plugin('done', (stats) => {
        const assets = JSON.stringify({assetsByChunkName: stats.toJson().assetsByChunkName, entrypoints: stats.toJson().entrypoints});
        fs.writeFileSync(`${resolve()}/build/stats.json`, assets)
      });
    },
  ]
};
