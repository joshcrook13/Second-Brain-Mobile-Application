const CACHE_NAME = 'second-brain-v3';
const urlsToCache = [
  './',
  './index.html',
  './login.html',
  './apps/restaurantindex.html',
  './apps/finance.html',
  './apps/Personalcrm.html',
  './apps/todo.html',
  './apps/journalapp.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});