const toolbox = require('sw-toolbox');
const CACHE_NAME = 'sw-test';
const HTML_FRAME = 'html-frame';
toolbox.options.debug = true;
toolbox.options.cache.name = CACHE_NAME;

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// Cache assets
toolbox.router.get(/\.(js|css|png|jpg|gif|svg)$/, toolbox.networkFirst);

// // Cache routes frames
// toolbox.router.get('/', routeHandler);
// toolbox.router.get('/about', routeHandler);
// toolbox.router.get('/contact', routeHandler);
// toolbox.router.get('/contact/me', routeHandler);

function routeHandler (request, values, options) {
  // toolbox.cache(`${request.url}?offline=true`);
  // toolbox.cache('https://api.mercadolibre.com/sites/MEC');
  // fetch('/?offline=true')
  //   .then(response => caches.open(CACHE_NAME).then(cache => cache.put(HTML_FRAME, response)));

  return new Promise((resolve, reject) => {
    fetch(request.url)
      .then(resolve)
      .catch(() => {
        caches.open(CACHE_NAME)
          .then(cache => resolve(cache.match(HTML_FRAME)))
          .catch(reject);
      });
  })
}