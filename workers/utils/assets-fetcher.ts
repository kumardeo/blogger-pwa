import mime from 'mime/lite';
import { type CacheOptions, cache } from './cache';

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

export type Options = CacheOptions & {
  toAsset?: (url: URL, request: Request) => string;
};

export class AssetsFetcher {
  #manifest: Record<string, string>;
  #namespace: KVNamespace;
  #context: ExecutionContext;

  constructor(namespace: KVNamespace, manifest: string | Record<string, string>, context: ExecutionContext) {
    this.#manifest = (typeof manifest === 'string' ? JSON.parse(manifest) : (manifest ?? {})) as Record<string, string>;
    this.#namespace = namespace;
    this.#context = context;
  }

  #getAsset(input: URL | string) {
    const path = (input instanceof URL ? input.pathname : input).replace(/^\/+/, '') || '/';
    let filePath: string | null = null;

    if (Object.prototype.hasOwnProperty.call(this.#manifest, path)) {
      filePath = path;
    } else if (path.endsWith('/')) {
      const otherPaths = Object.keys(this.#manifest)
        .filter((key) => new RegExp(`^${path === '/' ? '' : path}(/)?index.[a-zA-Z0-9]+$`).test(key))
        .sort((a, b) => {
          if (a.endsWith('.html')) return -1;
          if (b.endsWith('.html')) return 1;
          return a.localeCompare(b);
        });

      if (otherPaths.length > 0 && Object.prototype.hasOwnProperty.call(this.#manifest, otherPaths[0])) {
        filePath = otherPaths[0];
      }
    }

    if (filePath) {
      const filename = filePath.replace(/^.*[\\/]/, '');
      const extension = filename.match(/\.([0-9a-z]+)(?:[?#]|$)/i)?.[1];

      const mimeType = extension ? mime.getType(extension) : null;
      let contentType = mimeType;
      if (contentType?.startsWith('text') || contentType === 'application/javascript') {
        contentType += '; charset=utf-8';
      }

      const key = this.#manifest[filePath];
      const namespace = this.#namespace;
      return {
        input: path,
        path: filePath,
        key,
        filename,
        extension,
        mimeType,
        contentType,
        async text() {
          return namespace.get(key, 'text') as Promise<string>;
        },
        async json<T>() {
          return namespace.get(key, 'json') as Promise<T>;
        },
        async buffer() {
          return namespace.get(key, 'arrayBuffer') as Promise<ArrayBuffer>;
        },
        async stream() {
          return namespace.get(key, 'stream') as Promise<
            // biome-ignore lint/suspicious/noExplicitAny: we needed to use any here
            ReadableStream<any>
          >;
        },
        async file(defaultType = 'application/octet-stream') {
          const buffer = await this.buffer();
          return new File([buffer], this.filename, {
            type: this.contentType ?? defaultType,
          });
        },
      };
    }

    return null;
  }

  get(input: URL | string) {
    return this.#getAsset(input);
  }

  async fetch(request: Request, options: Options = {}) {
    const requestURL = new URL(request.url);
    const path = options.toAsset ? options.toAsset(requestURL, request) : requestURL.pathname;

    const result = this.#getAsset(path);
    if (result) {
      const defaultCacheKey = new Request(`${requestURL.origin}/__cached_assets_fetcher__/${result.key}${requestURL.search}`, request);
      const cacheKey = typeof options.cacheKey === 'function' ? options.cacheKey(defaultCacheKey) : (options.cacheKey ?? defaultCacheKey);
      const etag = result.key;

      return cache(
        request,
        this.#context,
        async () => {
          return new Response(await result.stream(), {
            headers: {
              'Content-Type': result.contentType ?? 'application/octet-stream',
            },
          });
        },
        {
          etag,
          ...options,
          cacheKey,
        },
      );
    }

    return null;
  }
}
