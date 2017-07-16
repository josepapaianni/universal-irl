const express = require('express');
const React = require('react');
const routes = require('../app/routes');
const ReactDOMServer = require('react-dom/server');
const {StaticRouter, matchPath} = require('react-router');
const router = express.Router();
const App = require('../app');


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

router.get('*', (req, res) => {
  const context = {};
  const chunks = getPossibleChunks(req.url);
  const asyncTasks = getAsyncTasks(req.url);

  const app = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App/>
    </StaticRouter>
  );

  // A small script to load scripts after DOM content load (maximize ssr speed)
  //  @param scripts {array}
  // const scriptTags = scripts.length > 0 ? `<script>window.addEventListener('load',function(){var s="${scripts}";if (s==='null'||s==='undefined')return;s=s.split(',');s.forEach(function(c){var t=document.createElement('script');t.src=c;t.async=false;t.defer=true;document.head.appendChild(t);})})</script>` : '';
  res.write(`
      <!doctype html>
      <head>
      </head>
      <body>
        <main id="root">
          ${app}
        </main>
      </body>`
  );

  res.end();

});


module.exports = router;