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


const CACHE_NAME = "taxify-pwa-cache-v3";
const OFFLINE_URL = "/";
const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "fonts.gstatic.com",
  "fonts.googleapis.com",
  "cdn.jsdelivr.net",
];

// Assets to cache
const FILES_TO_CACHE = [
  "/",
  "/manifest.json",
  "/styles/globals.css",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
];

// Install Service Worker & Cache Essential Files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate Service Worker & Cleanup Old Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Interceptor: Serve Cached UI Assets + Handle Next.js Static Files
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Handle Next.js Static Assets
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          return (
            cachedResponse ||
            fetch(event.request).then((fetchedResponse) => {
              cache.put(event.request, fetchedResponse.clone());
              return fetchedResponse;
            })
          );
        });
      })
    );
  } 
  // Handle Whitelisted CDN & Font Files
  else if (HOSTNAME_WHITELIST.includes(url.hostname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request)
            .then((response) => {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
              return response;
            })
            .catch(() => cached)
        );
      })
    );
  } 
  // Default: Try Fetching, Otherwise Serve Cached Version
  else {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
        .then((response) => response || caches.match(OFFLINE_URL))
    );
  }
});
