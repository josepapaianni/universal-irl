require('babel-register')({
    ignore: ['node_modules'],
});

require('css-modules-require-hook')({
    generateScopedName: '[path][name]-[local]'
});

const http = require('http');
const https = require('https');
const express = require('express');
const webpack = require('webpack');
const chokidar = require('chokidar');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./config/webpack.dev');
const server = require('./server');


class ServerApp {

    constructor() {
        const env = process.env.NODE_ENV || 'production';
        if (env === 'development') {
            this.development();
        } else {
            this.production();
        }
        this.listen();
    }

    development() {
        this.httpApp = express();
        const compiler = webpack(webpackConfig);

        this.httpApp.use(webpackDevMiddleware(compiler, {
            noInfo: false,
            publicPath: webpackConfig.output.publicPath,
            serverSideRender: true,
        }));

        this.httpApp.use(webpackHotMiddleware(compiler));
        this.httpApp.use(this.mapDevStatics);
        this.httpApp.use((req, res, next) => require('./server')(req, res, next));

        const watcher = chokidar.watch('./server');

        // Clean server app modules
        watcher.on('ready', function () {
            watcher.on('all', function () {
                console.log("Clearing /server/ module cache from server");
                Object.keys(require.cache).forEach(function (id) {
                    if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
                });
            });
        });

        // Clean React App modules
        compiler.plugin('done', function () {
            console.log("Clearing /client/ module cache from server");
            Object.keys(require.cache).forEach(function (id) {
                if (/[\/\\]app[\/\\]/.test(id) || /[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
            });
        });

        this.httpServer = http.createServer(this.httpApp);
    }

    production() {
        this.httpApp = express();
        this.httpsApp = express();
        const credentials = {
            key: fs.readFileSync('./config/ssl/server.key', 'utf8'),
            cert: fs.readFileSync('./config/ssl/server.crt', 'utf8')
        };
        const staticsMapping = require('./build/stats.json');
        this.httpsApp.use(express.static('./build'));
        this.httpsApp.use(this.mapProdStatics(staticsMapping));
        this.httpsApp.use(server);

        this.httpServer = http.createServer(this.httpApp);
        this.httpsServer = https.createServer(credentials, this.httpsApp);
    }

    mapDevStatics(req, res, next) {
        const bundles = res.locals.webpackStats.toJson().assetsByChunkName;
        res.staticAssets = Object.keys(bundles).reduce((acc, i) => {
            acc[i] = Array.isArray(bundles[i]) ? bundles[i] : [bundles[i]];
            return acc;
        }, {});
        next();
    }

    mapProdStatics(statics) {
        return (req, res, next) => {
            const bundles = statics.entrypoints;
            res.staticFiles = Object.keys(bundles).reduce((acc, i) => {
                i !== 'vendor' ? acc[i] = bundles[i].assets : null;
                return acc;
            }, {});
            res.assetsByChunkName = statics.assetsByChunkName;
            next();
        };
    }

    listen() {
        this.httpServer.listen(8080, () => console.log(`listening @${8080}`));
        this.httpsServer ? this.httpsServer.listen(8443, () => console.log(`listening @${8443}`)) : null;
    }
}

module.exports = new ServerApp();