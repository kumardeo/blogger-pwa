import { cacheNames, clientsClaim, setCacheNameDetails, skipWaiting } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing';
import { CacheFirst, NetworkOnly } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

/** Configurations for serviceworker */
const config = {
  app: {
    name: 'blogger-pwa',
    version: 'v1',
    precache: 'install-time',
    runtime: 'run-time',
  },
  fallback: '/app/fallback/',
  manifest: '/app/manifest.json',
  favicon: '/app/icons/favicon.ico',
};

skipWaiting();
clientsClaim();
setCacheNameDetails({
  prefix: config.app.name,
  suffix: config.app.version,
  precache: config.app.precache,
  runtime: config.app.runtime,
});

precacheAndRoute([
  { url: config.fallback, revision: null },
  { url: config.manifest, revision: null },
  { url: config.favicon, revision: null },
]);

setDefaultHandler(new NetworkOnly());

const version = cacheNames.suffix;

registerRoute(
  /.(?:css|js|png|gif|jpg|svg|ico)$/,
  new CacheFirst({
    cacheName: `images-js-css-${version}`,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 24 * 60 * 60,
        maxEntries: 200,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  'GET',
);

setCatchHandler(async ({ request }) => {
  switch (request.destination) {
    case 'document': {
      return caches.match(config.fallback) as Promise<Response>;
    }
    default: {
      return Response.error();
    }
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => keys.filter((key) => !key.endsWith(version)))
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key)))),
  );
});
