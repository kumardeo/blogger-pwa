import { cacheNames, clientsClaim, setCacheNameDetails } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing';
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
      return matchPrecache('/app/offline') as Promise<Response>;
    }
    default: {
      return Response.error();
    }
  }
});
