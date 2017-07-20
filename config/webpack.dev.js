const { name } = require('../package.json');
const { resolve } = require('path');
const webpack = require('webpack');

// function isSwDependency(module){
//   let find = false;
//   for (let item of module._chunks.values()){
//     if (item.name === 'sw') {
//       find = true;
//       break;
//     }
//   }
//   return find;
// }

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
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
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader?modules&localIdentName=[path][name]-[local]' },
        ],
      },
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
        NODE_ENV: JSON.stringify('development'),
        BROWSER: true,
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: function(module){
          return module.context && module.context.indexOf("node_modules") !== -1;
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
        minChunks: 2
    })
  ]
};
