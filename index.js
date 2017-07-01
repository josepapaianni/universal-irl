const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./config/webpack.dev');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

require('babel-register')({
  ignore: ['node_modules'],
});

const app = express();
const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  noInfo: false,
  publicPath: webpackConfig.output.publicPath,
  serverSideRender: true,
}));

app.use(webpackHotMiddleware(compiler));

app.use(function(req, res, next) {
  require('./server')(req, res, next);
});

app.listen(8080, ()=> console.log('listening @8080') );