/**
 * PWA build by Fineshop Design
 */
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

// Configurations for PWA App
const config = {
  app: {
    name: "fineshop-pwa-app",
    version: "v1",
    precache: "install-time",
    runtime: "run-time"
  },
  fallback: "/app/fallback/",
  manifest: "/app/manifest.json",
  favicon: "/app/icons/favicon.ico"
};

// Check if workbox-sw is successfully imported
if (typeof workbox !== "undefined") {
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();
  workbox.core.setCacheNameDetails({
    prefix: config.app.name,
    suffix: config.app.version,
    precache: config.app.precache,
    runtime: config.app.runtime
  });

  const version = workbox.core.cacheNames.suffix;
  workbox.precaching.precacheAndRoute([
    { url: config.fallback, revision: null },
    { url: config.manifest, revision: null },
    { url: config.favicon, revision: null }
  ]);

  workbox.routing.setDefaultHandler(new workbox.strategies.NetworkOnly());

  workbox.routing.registerRoute(
    new RegExp(".(?:css|js|png|gif|jpg|svg|ico)$"),
    new workbox.strategies.CacheFirst({
      cacheName: "images-js-css-" + version,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 24 * 60 * 60,
          maxEntries: 200,
          purgeOnQuotaError: true
        })
      ]
    }),
    "GET"
  );

  workbox.routing.setCatchHandler(({ event }) => {
    switch (event.request.destination) {
      case "document": {
        return caches.match(config.fallback);
      }
      default: {
        return Response.error();
      }
    }
  });

  self.addEventListener("activate", function (event) {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => keys.filter((key) => !key.endsWith(version)))
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
    );
  });
} else {
  console.log("Oops! Workbox did not load.");
}
