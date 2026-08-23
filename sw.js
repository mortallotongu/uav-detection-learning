/* Style reminder: Research Notebook — offline support must never mask a newer lesson build with stale cached HTML. Fresh navigation wins; cache is the fallback. */
const CACHE_NAME = "dfine-learning-v2";
const CORE = ["./", "./index.html", "./manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const request = event.request;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request, { cache: "no-store" }).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
      return response;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    const copy = response.clone();
    if (response.ok && new URL(request.url).origin === self.location.origin) caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    return response;
  })));
});
