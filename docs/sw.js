// Service Worker for Search Console for iOS Website
const CACHE_NAME = 'search-console-v43';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
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
  '/app-icon-512.jpg',
  '/icon-192.png',
  '/css/style.css?v=86',
  '/css/performance-chart.css?v=12',
  '/js/hero-dot-wave.js?v=14',
  '/js/site-ui.js?v=17',
  '/js/site-charts.js?v=14',
  '/js/i18n.js?v=14',
  '/js/site-chrome-scripts.js?v=14',
  '/AppAssetsWebsite/Image1.imageset/Image1.png?v=8',
  '/AppAssetsWebsite/Image2.imageset/Image2.png?v=8',
  '/AppAssetsWebsite/Image3.imageset/Image3.png?v=8',
  '/AppAssetsWebsite/Image4.imageset/Image4.png?v=8',
  '/AppAssetsWebsite/Image5.imageset/Image5.png?v=8',
  '/AppAssetsWebsite/Image6.imageset/Image6.png?v=8',
  '/AppAssetsWebsite/Image7.imageset/Image7.png?v=8',
  '/AppAssetsWebsite/Image8.imageset/Image8.png?v=8'
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
