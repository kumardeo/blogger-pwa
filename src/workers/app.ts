import assetsManifest from '__STATIC_CONTENT_MANIFEST';
import { Hono } from 'hono';
import { AssetsFetcher } from '../modules/assets-fetcher';

type HonoContext = {
  Bindings: CloudflareEnv;
  Variables: {
    assets: AssetsFetcher;
  };
};

export default new Hono<HonoContext>()
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
          bypassCache: c.env.CF_ENV === 'local',
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
