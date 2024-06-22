import type { ExecutionContext } from '@cloudflare/workers-types';

declare const caches: CacheStorage & { default: Cache };

export type FallbackFunctionValue = Response | null | undefined;

export type FallbackFunction = (request: Request, context: ExecutionContext) => FallbackFunctionValue | Promise<FallbackFunctionValue>;

export interface CacheOptions {
  cache?: string | Cache;
  cacheKey?: Request;
  etag?: string;
  defaultEtag?: 'strong' | 'weak';
  browserTTL?: number | null;
  edgeTTL?: number | null;
  bypassCache?: boolean;
}

/** Default etag */
const DEFAULT_CACHE_ETAG = 'strong';

/** Default cache options */
const DEFAULT_CACHE_OPTIONS = {
  defaultEtag: DEFAULT_CACHE_ETAG,
  browserTTL: undefined,
  edgeTTL: 2 * 60 * 60 * 24,
  bypassCache: false,
} as const;

/** Gets cache options */
const getCacheOptions = (options: CacheOptions | ((req: Request) => CacheOptions), request: Request): CacheOptions => {
  const userOptions = typeof options === 'function' ? options(request) : options;

  return { ...DEFAULT_CACHE_OPTIONS, ...userOptions };
};

/** Formats etag */
const formatETag = (entityId: string, validatorType: 'weak' | 'strong' = DEFAULT_CACHE_ETAG) => {
  let etag = entityId;
  if (!etag) {
    return '';
  }
  switch (validatorType) {
    case 'weak': {
      if (!etag.startsWith('W/')) {
        if (etag.startsWith(`"`) && etag.endsWith(`"`)) {
          return `W/${etag}`;
        }
        return `W/"${etag}"`;
      }
      return etag;
    }
    case 'strong': {
      if (etag.startsWith(`W/"`)) {
        etag = etag.replace('W/', '');
      }
      if (!etag.endsWith(`"`)) {
        etag = `"${etag}"`;
      }
      return etag;
    }
    default: {
      return '';
    }
  }
};

export const cache = async <F extends FallbackFunction = FallbackFunction>(
  request: Request,
  context: ExecutionContext,
  fallback: F,
  options: CacheOptions = {},
): Promise<Awaited<ReturnType<F>> extends Response ? Response : Response | null> => {
  const cacheOptions = getCacheOptions(options, request);

  const requestMethod = request.method.toUpperCase();
  if (!['GET', 'HEAD'].includes(requestMethod)) {
    throw new Error(`Request method ${requestMethod} cannot be cached`);
  }

  const shouldEdgeCache = !(cacheOptions.bypassCache || cacheOptions.edgeTTL === null || request.method === 'HEAD');

  const shouldSetBrowserCache = typeof cacheOptions.browserTTL === 'number';

  const cacheKey = cacheOptions.cacheKey ?? request;

  const cacheStorage: Cache = typeof cacheOptions.cache === 'string' ? await caches.open(cacheOptions.cache) : cacheOptions.cache ?? caches.default;

  let response: Response | null | undefined = shouldEdgeCache ? await cacheStorage.match(cacheKey) : undefined;

  if (response instanceof Response) {
    if (response.status > 300 && response.status < 400) {
      if (response.body && 'cancel' in Object.getPrototypeOf(response.body)) {
        // Body exists and environment supports readable streams
        await response.body.cancel();
      } else {
        // Environment doesn't support readable streams, or null response body. Nothing to do
      }
      response = new Response(null, response);
    } else {
      const responseInit = {
        headers: new Headers(response.headers),
        status: 0,
        statusText: '',
      };

      responseInit.headers.set('Cf-Cache-Status', 'HIT');

      if (response.status) {
        responseInit.status = response.status;
        responseInit.statusText = response.statusText;
      } else if (responseInit.headers.has('Content-Range')) {
        responseInit.status = 206;
        responseInit.statusText = 'Partial Content';
      } else {
        responseInit.status = 200;
        responseInit.statusText = 'OK';
      }
      response = new Response(response.body, responseInit);
    }
  } else {
    const fallbackResponse = await fallback(request, context);
    if (fallbackResponse instanceof Response) {
      response = fallbackResponse;
    } else {
      return null as Awaited<ReturnType<F>> extends Response ? Response : Response | null;
    }

    // Skip caching if response status code is not >= 200 and < 400
    if (response.status < 200 || response.status >= 400) {
      return response;
    }

    if (shouldEdgeCache) {
      // const buffer = await response.clone().arrayBuffer();
      response.headers.set('Accept-Ranges', 'bytes');
      // response.headers.set("Content-Length", String(buffer.byteLength));
      // Set Etag before cache insertion
      if (!response.headers.has('Etag') && typeof options.etag === 'string') {
        response.headers.set('Etag', formatETag(options.etag, cacheOptions.defaultEtag));
      }
      // Determine Cloudflare cache behavior
      response.headers.set('Cache-Control', `max-age=${cacheOptions.edgeTTL as number}`);
      context.waitUntil(cacheStorage.put(cacheKey, response.clone()));
      response.headers.set('CF-Cache-Status', 'MISS');
    }
  }

  if (response.status === 304) {
    let etag: null | string = response.headers.get('Etag');
    if (etag) {
      etag = formatETag(etag, cacheOptions.defaultEtag);
    }
    const ifNoneMatch = cacheKey.headers.get('If-None-Match');
    const proxyCacheStatus = response.headers.get('CF-Cache-Status');
    if (etag) {
      if (ifNoneMatch && ifNoneMatch === etag && proxyCacheStatus === 'MISS') {
        response.headers.set('CF-Cache-Status', 'EXPIRED');
      } else {
        response.headers.set('CF-Cache-Status', 'REVALIDATED');
      }
      response.headers.set('Etag', formatETag(etag, 'weak'));
    }
  }

  if (shouldSetBrowserCache) {
    response.headers.set('Cache-Control', `max-age=${cacheOptions.browserTTL as number}`);
  } else {
    response.headers.delete('Cache-Control');
  }

  return response;
};
