import { GithubAssets } from '@/modules/github-assets';
import { Hono } from 'hono';
import { metadata } from '../../scripts/metadata';

type HonoContext = {
  Bindings: CloudflareEnv;
  Variables: {
    github: GithubAssets;
    cache: Cache;
  };
};

const app = new Hono<HonoContext>()
  .use(async (c, next) => {
    const github = new GithubAssets(c.executionCtx, metadata.github.repository, metadata.github.branch);
    const cache = await caches.open(`build_cache_${metadata.build.hash}`);

    c.set('github', github);
    c.set('cache', cache);

    await next();
  })
  .get('*', async (c) => {
    switch (c.req.method) {
      case 'GET':
      case 'HEAD': {
        const response = await c.var.github.fetch(c.req.raw, {
          // Bypass cache in development environment
          // bypassCache: c.env.CF_ENV === 'local',
          toAsset: (url) => `/bucket${url.pathname}`,
          cacheKey(defaultKey) {
            const url = new URL(defaultKey.url);
            url.pathname = `__cache_build_${metadata.build.hash}__${url.pathname}`;
            return new Request(url, defaultKey);
          },
          etag: `build_${metadata.build.hash}_${new URL(c.req.url).pathname}`,
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
} satisfies ExportedHandler<CloudflareEnv>;
