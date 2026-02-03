// Service Worker for Search Console for iOS Website
const CACHE_NAME = 'search-console-v6';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/privacy.html',
  '/terms.html',
  '/404.html',
  '/manifest.json',
  '/favicon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/app-icon-512.jpg',
  '/icon-192.jpg',
  '/AppAssetsWebsite/Category-7.imageset/Category-7.jpg?v=3',
  '/AppAssetsWebsite/Category-1.imageset/Category-1.jpg?v=3',
  '/AppAssetsWebsite/Category.imageset/Category.jpg?v=3',
  '/AppAssetsWebsite/Category-2.imageset/Category-2.jpg?v=3',
  '/AppAssetsWebsite/Category-3.imageset/Category-3.jpg?v=3',
  '/AppAssetsWebsite/Category-4.imageset/Category-4.jpg?v=3'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first for HTML (fresh content after deploy), cache first for assets
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  var isHtml = event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html');

  if (isHtml) {
    // HTML: network first so users see new content after deploy; fallback to cache when offline
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('/404.html')))
    );
    return;
  }

  // Assets: cache first, revalidate in background
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        event.waitUntil(
          fetch(event.request)
            .then(response => {
              if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response));
            })
            .catch(() => {})
        );
        return cachedResponse;
      }
      return fetch(event.request).then(response => {
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => null);
    })
  );
});
