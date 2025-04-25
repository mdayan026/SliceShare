const CACHE_NAME = "expense-splitter-cache-v1";
const ASSETS_TO_CACHE = [
    "./index.html",
    "./styles.css",
    "./ui.js",
    "./logic.js",
    "./darkMode.js",
    "./export.js",
    "./manifest.json",
    "./bill192.png",
    "./bill512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName))
            )
        )
    );
});