// const HOSTNAME_WHITELIST = [
//   self.location.hostname,
//   "fonts.gstatic.com",
//   "fonts.googleapis.com",
//   "cdn.jsdelivr.net",
// ];

// // The Util Function to hack URLs of intercepted requests
// const getFixedUrl = (req) => {
//   var now = Date.now();
//   var url = new URL(req.url);

//   url.protocol = self.location.protocol;

//   if (url.hostname === self.location.hostname) {
//     url.search += (url.search ? "&" : "?") + "cache-bust=" + now;
//   }
//   return url.href;
// };

// /**
//  *  @Lifecycle Activate
//  *  New one activated when old isnt being used.
//  *
//  *  waitUntil(): activating ====> activated
//  */
// self.addEventListener("activate", (event) => {
//   event.waitUntil(self.clients.claim());
// });

// /**
//  *  @Functional Fetch
//  *  All network requests are being intercepted here.
//  *
//  *  void respondWith(Promise<Response> r)
//  */
// self.addEventListener("fetch", (event) => {
//   if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
//     const cached = caches.match(event.request);
//     const fixedUrl = getFixedUrl(event.request);
//     const fetched = fetch(fixedUrl, { cache: "no-store" });
//     const fetchedCopy = fetched.then((resp) => resp.clone());

//     event.respondWith(
//       Promise.race([fetched.catch((_) => cached), cached])
//         .then((resp) => resp || fetched)
//         .catch((_) => {
//           /* eat any errors */
//         })
//     );

//     event.waitUntil(
//       Promise.all([fetchedCopy, caches.open("pwa-cache")])
//         .then(
//           ([response, cache]) =>
//             response.ok && cache.put(event.request, response)
//         )
//         .catch((_) => {
//           /* eat any errors */
//         })
//     );
//   }
// });

// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)
const CACHE = "Tranzit-offline-cache";

importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

// Set the correct offline fallback page
const offlineFallbackPage = "/";

// Skip waiting to update the service worker immediately
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Cache the offline fallback page on install
self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll([
        offlineFallbackPage,
        "/manifest.json",
        "/favicon.ico",
        "/styles/globals.css",
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
      ]);
    })
  );
});

// Enable navigation preload
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Cache and serve Next.js static assets (`/_next/static/`)
workbox.routing.registerRoute(
  new RegExp("/_next/static/.*"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "next-static-assets",
  })
);

// Cache all requests for better offline experience
workbox.routing.registerRoute(
  new RegExp("/*"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE,
  })
);

// Handle fetch requests and return cached UI when offline
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          console.warn("⚠️ Offline, serving cached page:", event.request.url);
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })()
    );
  }
});
