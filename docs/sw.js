// The site no longer uses a service worker. Phones that visited before still have the old one,
// and it sat between the page and its images and film. This version removes itself: it clears
// every cache it made, unregisters, and reloads open pages so they talk to the network directly.
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (names) { return Promise.all(names.map(function (name) { return caches.delete(name); })); })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (clients) {
        clients.forEach(function (client) {
          if (client.navigate) client.navigate(client.url).catch(function () {});
        });
      })
      .catch(function () {})
  );
});
