const STATIC_CACHE_NAME = 'pwa-torneos-static-v3';
const DYNAMIC_CACHE_NAME = 'pwa-torneos-dynamic-v3';
const API_CACHE_NAME = 'pwa-torneos-api-v3';

// App shell files
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/assets/hero1.png',
    '/assets/hero2.png'
];

const API_ROUTES = [
    '/tournaments',
    '/events',
    '/athletes',
    '/inscriptions',
    '/results'
];

// INSTALL: Cache the app shell
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker v3...');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(cache => {
            console.log('[SW] Caching App Shell...');
            return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' }))).catch(err => {
                console.warn('[SW] Some static assets failed to cache:', err);
            });
        })
    );
    self.skipWaiting(); // Activate immediately
});

// ACTIVATE: Clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME && key !== API_CACHE_NAME) {
                    console.log('[SW] Removing old cache:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim(); // Take control of all pages immediately
});

// FETCH: Apply caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests (unless they're our API)
    if (url.origin !== location.origin && !url.pathname.startsWith('/api')) {
        return;
    }

    // API requests: Network-First with fallback to cache
    if (API_ROUTES.some(route => url.pathname.includes(route))) {
        event.respondWith(
            caches.open(API_CACHE_NAME).then(cache => {
                return fetch(request)
                    .then(networkResponse => {
                        // Cache successful responses
                        if (networkResponse.status === 200) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Return cached version if network fails
                        return cache.match(request).then(cachedResponse => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            // Return offline fallback
                            return new Response(
                                JSON.stringify({ error: 'No connection available', offline: true }),
                                {
                                    headers: { 'Content-Type': 'application/json' },
                                    status: 503
                                }
                            );
                        });
                    });
            })
        );
        return;
    }

    // Static files: Cache-First
    if (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith('/src/') || url.pathname.startsWith('/assets/')) {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then(networkResponse => {
                    if (networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(STATIC_CACHE_NAME).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                });
            })
        );
        return;
    }

    // Other requests: Network-First, then cache
    event.respondWith(
        caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            return fetch(request)
                .then(networkResponse => {
                    if (networkResponse.status === 200) {
                        cache.put(request, networkResponse.clone());
                    }
                    return networkResponse;
                })
                .catch(() => {
                    return cache.match(request).then(cachedResponse => {
                        return cachedResponse || new Response('Offline - Content not available', {
                            status: 503,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
                });
        })
    );
});

// Background sync for offline actions (if supported)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-results') {
        event.waitUntil(syncResults());
    }
});

async function syncResults() {
    // This would sync any pending results when connection is restored
    console.log('[SW] Syncing results...');
}

// Push notifications (if needed in future)
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'PWA Torneos';
    const options = {
        body: data.body || 'Nueva actualización disponible',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [200, 100, 200],
        data: data.url || '/'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});
