// --- CONFIGURATION ---
// CHANGE THIS NUMBER whenever you update your app
const CACHE_NAME = 'josh-os-v28'; 

// Add any new files you create here
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

// --- INSTALLATION (Force Update) ---
self.addEventListener('install', event => {
    self.skipWaiting(); // <--- This forces the new version to take over IMMEDIATELY
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// --- ACTIVATION (Clean up old versions) ---
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache); // <--- Deletes the old "sticky" version
                    }
                })
            );
        }).then(() => self.clients.claim()) // <--- Takes control of the page immediately
    );
});

// --- FETCH (Network First, Cache Fallback) ---
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // If we are online, clone the fresh response to cache
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
                // If offline, use the cached version
                return caches.match(event.request);
            })
    );
});