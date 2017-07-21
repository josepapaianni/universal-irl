const toolbox = require('sw-toolbox');

toolbox.options.debug = true;
toolbox.options.cache.name = 'sw-test';

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// Cache assets
toolbox.router.get(/\.(js|css|png|jpg|gif|svg)$/, toolbox.networkFirst);

// Cache routes frames
toolbox.router.get('/', routeHandler);
toolbox.router.get('/about', routeHandler);
toolbox.router.get('/contact', routeHandler);
toolbox.router.get('/contact/me', routeHandler);

function routeHandler (request, values, options) {
  toolbox.cache(`${request.url}?offline=true`);
  return new Promise((resolve) => {
    fetch(request.url)
      .then(resolve)
      .catch(() => {
        caches.open(toolbox.options.cache.name)
          .then(cache => resolve(cache.match(`${request.url}?offline=true`)));
      });
  })
}