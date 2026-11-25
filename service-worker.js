const CACHE_NAME = "avanti-kassensystem-v2";
const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./Logo1zu1.png",
    "./gluehwein.png",
    "./gluehwein-schuss.png",
    "./kakao.png",
    "./kakao-schuss.png",
    "./kinderpunsch.png",
    "./pfand.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName.startsWith("avanti-kassensystem-") && cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const requestUrl = new URL(event.request.url);
    if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                if (response.ok) {
                    const responseCopy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
                }
                return response;
            });
        })
    );
});
