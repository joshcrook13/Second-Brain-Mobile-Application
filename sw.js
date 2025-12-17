const CACHE_NAME = 'josh-os-live'; // Single static name, no numbers needed
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './apps/todo.html',
  './apps/finance.html',
  './apps/journalapp.html',
  './apps/Personalcrm.html',
  './apps/restaurantindex.html'
];

// 1. Install & Activate Immediately (No Waiting)
self.addEventListener('install', event => {
    // Force this worker to become active immediately
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    // Tell the active worker to take control of the page immediately
    event.waitUntil(clients.claim());
});

// 2. The "Network First" Logic
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // If we got a valid response from the net, CLONE it to cache
                // so we have it for next time (offline mode)
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            })
            .catch(() => {
                // If network fails (offline), fall back to cache
                return caches.match(event.request);
            })
    );
});