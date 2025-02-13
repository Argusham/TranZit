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

const CACHE = "pwabuilder-offline-page";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "ToDo-replace-this-name.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});