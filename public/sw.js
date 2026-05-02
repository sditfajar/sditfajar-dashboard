// Kosong saja tidak apa-apa agar registrasi service worker tidak 404
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});