// Service Worker for Search Console for iOS Website
const CACHE_NAME = 'search-console-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
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

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests (fonts, analytics)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached version and update cache in background
          event.waitUntil(
            fetch(event.request)
              .then(response => {
                if (response.ok) {
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, response));
                }
              })
              .catch(() => {})
          );
          return cachedResponse;
        }
        
        // Not in cache - fetch from network
        return fetch(event.request)
          .then(response => {
            // Cache successful responses
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
            }
            return response;
          })
          .catch(() => {
            // Offline fallback for HTML pages
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/404.html');
            }
          });
      })
  );
});
