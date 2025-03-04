const CACHE_NAME = 'my-blog-cache-v2'; // Updated cache version
const HTML_FILES = [
    'blogpage.html',
    'index.html',
    'Businesspage.html',
    'cryptopage.html',
    'Fintechpage.html',
    'Investingpage.html',
    'Moneytips.html',
    'mindset.html'
];
const OTHER_ASSETS = [
    'blogpage.js',
    'blogpage.css',
    '4streetcategories.css',
    '4street.js',
    'manifest.json',
    'version.json'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache:', CACHE_NAME);
            return cache.addAll([...HTML_FILES, ...OTHER_ASSETS]);
        })
    );
});

self.addEventListener('activate', event => {
    self.clients.claim();
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            if (self.registration.navigationPreload) {
                return self.registration.navigationPreload.enable();
            }
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                console.log('Serving from cache:', event.request.url);
                return cachedResponse;
            }
            return fetch(event.request).then(networkResponse => {
                if (networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(error => {
                console.error('Fetch failed:', error);
                return new Response('Offline. Asset may be unavailable.', { status: 503 });
            });
        })
    );
});
