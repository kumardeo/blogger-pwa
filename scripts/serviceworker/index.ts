import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { clientsClaim, setCacheNameDetails } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkOnly } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

setCacheNameDetails({
  prefix: 'blogger-pwa',
  suffix: 'v1',
  precache: 'install-time',
  runtime: 'run-time',
});

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ sameOrigin, request }) => sameOrigin && request.mode === 'navigate',
  new NetworkOnly({
    plugins: [
      {
        handlerDidError: async ({ request, error }) => {
          console.log('[sw] handlerDidError', request.url, error);

          if (error && 'name' in error && error.name === 'no-response') {
            return await matchPrecache('/app/offline/index.html');
          }
        },
      },
    ],
  }),
);

registerRoute(
  ({ request, url }) => request.destination === 'style' && /^https:\/\/fonts\.googleapis\.com$/i.test(url.origin),
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);

registerRoute(
  ({ request, url }) => request.destination === 'font' && /^https:\/\/fonts\.gstatic\.com$/i.test(url.origin),
  new CacheFirst({
    cacheName: 'gstatic-fonts-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 40,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);
