/* Self-unregistering service worker - replaces stale Project Atlas SW */
/* This clears old cached JS/CSS bundles that caused stale UI on mobile */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter((n) => n.startsWith('atlas-')).map((n) => caches.delete(n))
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      return self.registration.unregister();
    })
  );
});
