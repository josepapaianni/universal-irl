const express = require('express');
const React = require('react');
const routes = require('../app/routes');
const ReactDOMServer = require('react-dom/server');
const {StaticRouter, matchPath} = require('react-router');
const router = express.Router();
const App = require('../app');

// This function matches the request url with
// routes config to know if we need to search
// for additional chunks
function getPossibleChunks(url) {
  const chunks = [];
  routes.some(route => {
    const match = matchPath(url, route);
    if (match) {
      chunks.push(route.path.match(/([^\/]*)\/*$/)[1]);
      let subRoutes = route.routes;
      while (subRoutes) {
        subRoutes.some(route => {
          const match = matchPath(url, route);
          if (match) {
            chunks.push(route.path.match(/([^\/]*)\/*$/)[1]);
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
  return asyncTasks.length > 0 ? asyncTasks : null;
}


// This function ensures that if there's any chunk available
// for the requested url it will be available before
// the main app chunk (or shell), this way the app rendered
// on the server will sync with the client one
function getScripts(requestChunks, staticAssets){
  const scripts = [];
  staticAssets['manifest'] ? scripts.push(...staticAssets['manifest'].filter(file => file.endsWith('js'))) : null;
  staticAssets['vendor'] ? scripts.push(...staticAssets['vendor'].filter(file => file.endsWith('js'))) : null;
  for(let i = 0; requestChunks && i < requestChunks.length;  i++) {
    scripts.push(...staticAssets[requestChunks[i]].filter(file => file.endsWith('js')))
  }
  staticAssets['app'] ? scripts.push(...staticAssets['app'].filter(file => file.endsWith('js'))) : null;
  return scripts;
}

router.get('*', (req, res) => {
  const context = {};
  const requestChunks = getPossibleChunks(req.url);
  const asyncTasks = getAsyncTasks(req.url);
  const scripts = getScripts(requestChunks, res.staticAssets).map(src => res.staticPath + src);

  const app = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App/>
    </StaticRouter>
  );

  // A small script to load scripts after DOM content load (maximize ssr speed)
  //  @param scripts {array}
  const scriptTags = scripts.length > 0 ? `<script>window.addEventListener('load',function(){var s="${scripts}";if (s==='null'||s==='undefined')return;s=s.split(',');s.forEach(function(c){var t=document.createElement('script');t.src=c;t.async=false;t.defer=true;document.head.appendChild(t);})})</script>` : '';
  res.write(`
      <!doctype html>
      <head>${scriptTags}</head>
      <body>
        <main id="root">${app}</main>
      </body>`
  );

  res.end();

});


module.exports = router;