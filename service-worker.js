const CACHE_NAME = 'my-blog-cache-v1'; // Updated cache version
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

// IndexedDB Setup (Conceptual - Future Implementation)
const DB_NAME = 'blog-data';
const DB_VERSION = 1;
const STORE_NAME = 'posts';

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = event => reject(event.target.error);
        request.onsuccess = event => resolve(event.target.result);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        };
    });
}

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
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            if (self.registration.navigationPreload) {
                return self.registration.navigationPreload.enable();
            }
        }).then(() => {
            if (navigator.storage && navigator.storage.persist) {
                return navigator.storage.persist().then(granted => {
                    if (granted) {
                        console.log('Storage will not be cleared except by explicit user action');
                    } else {
                        console.log('Storage might be cleared by the UA under storage pressure.');
                    }
                });
            }
        })
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    if (url.pathname.endsWith('favicon.ico')) {
        event.respondWith(fetch(event.request).catch(error => {
            console.error('Failed to fetch favicon.ico:', error);
            return new Response('', { status: 404 });
        }));
        return;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(event.preloadResponse.then(preloadResponse => {
            if (preloadResponse) {
                return preloadResponse;
            }
            return fetch(event.request);
        }).catch(() => {
            return caches.match('index.html'); // Fallback for navigations
        }));
        return;
    }

    if (HTML_FILES.includes(url.pathname.slice(1))) {
        event.respondWith(
            caches.match('version.json').then(versionResponse => {
                if (!versionResponse) {
                    console.log('version.json not found in cache. Fetching from network.');
                    return fetchAndCache(event.request);
                }
                return versionResponse.json().then(versionData => {
                    console.log('versionData:', versionData);
                    return caches.match(event.request).then(cachedResponse => {
                        if (!cachedResponse) {
                            console.log('HTML file not found in cache. Fetching from network.');
                            return fetchAndCache(event.request);
                        }
                        const fileName = url.pathname.slice(1);
                        console.log('fileName:', fileName);
                        return fetch(event.request).then(networkResponse => {
                            if (networkResponse.status === 200) {
                                return caches.match('version.json').then(newVersionResponse => {
                                    return newVersionResponse.json().then(currentVersionData => {
                                        console.log('currentVersionData:', currentVersionData);
                                        if (currentVersionData[fileName] !== versionData[fileName]) {
                                            console.log('Versions differ, updating cache.');
                                            return fetchAndCache(event.request);
                                        } else {
                                            console.log('Versions match, serving cache.');
                                            return cachedResponse;
                                        }
                                    });
                                });
                            } else {
                                console.log('Network error, serving cache.');
                                return cachedResponse;
                            }
                        }).catch(() => {
                            console.log('Fetch failed, serving cache.');
                            return cachedResponse;
                        });
                    });
                });
            }).catch(error => {
                console.error('Error fetching version.json:', error);
                return fetchAndCache(event.request);
            })
        );
        return;
    }

    if (event.request.destination === 'image') {
        event.respondWith(
            caches.match(event.request).then(response => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    if (networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch(error => {
                    console.error('Failed to fetch image:', error);
                    if (response) {
                        return response;
                    }
                    return new Response('Image unavailable. Please check your network connection.', { status: 404 });
                });
                return response || fetchPromise;
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                if (networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(error => {
                console.error('Failed to fetch asset:', error);
                return response || new Response('Offline. Asset may be unavailable.', { status: 503 });
            });
            return response || fetchPromise;
        })
    );
});

function fetchAndCache(request) {
    return fetch(request).then(networkResponse => {
        if (networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseToCache);
            });
        }
        return networkResponse;
    });
}