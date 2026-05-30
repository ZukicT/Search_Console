// Service Worker for Search Console for iOS Website
const CACHE_NAME = 'search-console-v100';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/blog.html',
  '/about.html',
  '/privacy.html',
  '/terms.html',
  '/releases.html',
  '/404.html',
  '/manifest.json',
  '/favicon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/founder.jpg',
  '/Bot.png',
  '/Bot-72.png',
  '/Bot-96.png',
  '/Bot-144.png',
  '/Bot-200.png',
  '/app-icon.jpg',
  '/app-icon-512.jpg',
  '/icon-192.png',
];

function isHtmlRequest(request) {
  var accept = request.headers.get('accept');
  return accept && accept.indexOf('text/html') !== -1;
}

function isVersionedAsset(url) {
  return /\.(?:css|js)(?:\?|$)/.test(url.pathname) || /[?&]v=\d+/.test(url.search);
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(ASSETS_TO_CACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) { return name !== CACHE_NAME; })
          .map(function (name) { return caches.delete(name); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  var url = new URL(event.request.url);

  if (url.pathname === '/sw.js') {
    event.respondWith(fetch(event.request));
    return;
  }

  if (isHtmlRequest(event.request) || isVersionedAsset(url)) {
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(function () {
          return caches.match(event.request).then(function (cached) {
            return cached || (isHtmlRequest(event.request) ? caches.match('/404.html') : null);
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        event.waitUntil(
          fetch(event.request)
            .then(function (response) {
              if (response.ok) {
                caches.open(CACHE_NAME).then(function (cache) {
                  cache.put(event.request, response);
                });
              }
            })
            .catch(function () {})
        );
        return cachedResponse;
      }

      return fetch(event.request).then(function (response) {
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function () { return null; });
    })
  );
});
