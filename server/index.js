const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router');
const router = express.Router();
const App = require('../app');

router.get('*', (req, res) => {
  const context = {};
  const html = ReactDOMServer.renderToString(
    <StaticRouter
      location={req.url}
      context={context}
    >
      <App/>
    </StaticRouter>
  );

  res.write(`
      <!doctype html>
      <div id="root">${html}</div>
      <script src='/manifest.js'></script>
      <script src='/vendor.js'></script>
      <script src='/app.js'></script>
    `);

  res.end();

});


module.exports = router;