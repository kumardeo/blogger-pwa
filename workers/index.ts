import assetsManifest from '__STATIC_CONTENT_MANIFEST';
import { Hono } from 'hono';
import { metadata } from '../metadata';
import { AssetsFetcher } from './utils/assets-fetcher';

type HonoContext = {
  Bindings: Env & { __STATIC_CONTENT: KVNamespace };
  Variables: {
    assets: AssetsFetcher;
  };
};

const app = new Hono<HonoContext>()
  .use(async (c, next) => {
    const assets = new AssetsFetcher(c.env.__STATIC_CONTENT, assetsManifest, c.executionCtx);

    c.set('assets', assets);

    await next();
  })
  .get('*', async (c) => {
    const { assets } = c.var;
    switch (c.req.method) {
      case 'GET':
      case 'HEAD': {
        const response = await assets.fetch(c.req.raw, {
          // Bypass cache in development environment
          // bypassCache: c.env.CF_ENV === 'local',
          cacheKey(defaultKey) {
            const url = new URL(defaultKey.url);
            url.pathname = `__cache_build_${metadata.build.hash}__${url.pathname}`;
            return new Request(url, defaultKey);
          },
        });
        if (response) {
          // Set Service-Worker-Allowed header if asset is serviceworker.js
          if (/\/(service-?worker.js|sw.js)/.test(c.req.url)) {
            response.headers.set('Service-Worker-Allowed', '/');
          }
          return response;
        }
        return c.json(
          {
            success: false,
            error: {
              code: 'not_found',
              message: 'File not found',
            },
          },
          404,
        );
      }
      default: {
        return c.json(
          {
            success: false,
            error: {
              code: 'method_not_allowed',
              message: 'Method not allowed',
            },
          },
          405,
        );
      }
    }
  });

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;
