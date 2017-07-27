const express = require('express');
const React = require('react');
const { createStore } = require('redux');
const { Provider } = require('react-redux');
const routes = require('../app/routes');
const ReactDOMServer = require('react-dom/server');
const {StaticRouter, matchPath} = require('react-router');
const router = express.Router();
const App = require('../app');
const reducers = require('../app/reducers');

// This function matches the request url with
// routes config to know if we need to search
// for additional chunks
function getPossibleChunks(url) {
  const chunks = [];
  routes.some(route => {
    const match = matchPath(url, route);
    if (match) {
      chunks.push(route.chunkName);
      let subRoutes = route.routes;
      while (subRoutes) {
        subRoutes.some(route => {
          const match = matchPath(url, route);
          if (match) {
            chunks.push(route.chunkName);
            subRoutes = route.routes;
          } else {
            subRoutes = null;
          }
        })
      }
    }
  });
  return chunks.length > 0 ? chunks : null;
}

// This function matches the request url with
// routes config to know if we need to execute
// async tasks before rendering
function getAsyncTasks(url) {
  const asyncTasks = [];
  routes.some(route => {
    const match = matchPath(url, route);
    if (match && route.loadData) {
      asyncTasks.push(route.loadData(match));
    }
  });
  return asyncTasks;
}


// This function ensures that if there's any chunk available
// for the requested url it will be available before
// the main app chunk (or shell), this way the app rendered
// on the server will sync with the client one
function getScripts(requestChunks, staticAssets, isOffline){
  const scripts = [];
  staticAssets['manifest'] ? scripts.push(...staticAssets['manifest'].filter(file => file.endsWith('js'))) : null;
  staticAssets['vendor'] ? scripts.push(...staticAssets['vendor'].filter(file => file.endsWith('js'))) : null;
  if (!isOffline){
    for(let i = 0; requestChunks && i < requestChunks.length;  i++) {
      scripts.push(...staticAssets[requestChunks[i]].filter(file => file.endsWith('js')))
    }
  }
  staticAssets['app'] ? scripts.push(...staticAssets['app'].filter(file => file.endsWith('js'))) : null;
  return scripts;
}

function getScriptsTags(scripts){
  if (scripts.length <= 0) {
    return '';
  } else {
    // A small script to load scripts after DOM content load (maximize ssr speed)
    //  @param scripts {array}
    return `<script>window.addEventListener('load',function(){var a='${scripts}';'null'==a||'undefined'==a||(a=a.split(','),a.forEach(function(b){var d=document.createElement('script');d.src=b,d.async=!1,d.defer=!0,document.head.appendChild(d)}))});</script>`
  }
}


router.get('*', (req, res) => {
  const context = {};
  const requestChunks = getPossibleChunks(req.path);
  const isOffline = req.query.offline === 'true';
  const asyncTasks = getAsyncTasks(req.path);
  const scripts = getScripts(requestChunks, res.staticAssets, isOffline).map(src => res.staticPath + src);
  const store = createStore(reducers, []);
  console.log('offline: ', isOffline);
  Promise.all(asyncTasks)
    .then(data => {
      const app = ReactDOMServer.renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App/>
          </StaticRouter>
        </Provider>
      );

      const preloadedState = store.getState();

      const scriptTags = getScriptsTags(scripts);
      res.write(`
        <!doctype html>
        <head>
          ${isOffline ? '' : `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}</script>`}
          <link rel="shortcut icon" href="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-128.png">
          ${scriptTags}
        </head>
        <body>
          <main id="root">${isOffline ? '' : app}</main>
        </body>`
      );
      res.end();
    });

});


module.exports = router;
