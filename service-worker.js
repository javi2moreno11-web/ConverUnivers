const CACHE_NAME = "converunivers-v2";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/almacenamiento.html",
  "/area.html",
  "/calculadora.html",
  "/criptomonedas.html",
  "/energia.html",
  "/longitud.html",
  "/monedas.html",
  "/peso.html",
  "/presion.html",
  "/temperatura.html",
  "/tiempo.html",
  "/velocidad.html",
  "/volumen.html",
  "/zonashorarias.html",
  "/style.css",
  "/script.js",
  "/inicio.js",
  "/theme.js",
  "/acciones.js",
  "/converter-utils.js",
  "/almacenamiento.js",
  "/area.js",
  "/calculadora.js",
  "/criptomonedas.js",
  "/energia.js",
  "/longitud.js",
  "/monedas.js",
  "/peso.js",
  "/presion.js",
  "/temperatura.js",
  "/tiempo.js",
  "/velocidad.js",
  "/volumen.js",
  "/zonashorarias.js",
  "/manifest.json",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/robots.txt",
  "/sitemap.xml",
  "/offline.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return undefined;
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline.html").then((response) => response || caches.match("/index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => caches.match("/offline.html").then((response) => response || caches.match("/index.html")));
    })
  );
});