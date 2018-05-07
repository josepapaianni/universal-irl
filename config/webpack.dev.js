const { name } = require('../package.json');
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      'webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr&overlay=false',
      'webpack/hot/only-dev-server',
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
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader?modules&localIdentName=[path][name]-[local]' },
        ],
      },
      {
        test: /\.(png|svg|gif|jpg)$/,
        use: [
          { loader: 'file-loader' },
          { loader: 'img-loader' }
        ],
      },
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      name: true,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: -10
        },
      },
    },
  },
  output: {
    path: resolve() + '/public/',
    filename: '[name].js',
    publicPath: '/'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: true,
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
