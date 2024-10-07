import mime from 'mime/lite';
import { type CacheOptions, cache } from '../cache';

export type Options = CacheOptions & {
  toAsset?: (url: URL, request: Request) => string;
};

export class GithubAssets {
  #context: ExecutionContext;
  #repository: string;
  #branch: string;
  #token?: string;

  constructor(context: ExecutionContext, repository: string, branch = 'main', token?: string) {
    this.#context = context;
    this.#repository = repository;
    this.#branch = branch;
    this.#token = token;
  }

  get root() {
    return `https://raw.githubusercontent.com/${this.#repository}/${this.#branch}`;
  }

  async get(path: string) {
    let url = `${this.root}/${path.replace(/^\/+/, '')}`;
    if (url.endsWith('/')) {
      url += 'index.html';
    }

    const requestHeaders = new Headers();
    if (this.#token) {
      requestHeaders.set('Authorization', `Bearer ${this.#token}`);
    }

    const response = await fetch(url, {
      headers: requestHeaders,
    });

    if (response.ok) {
      const filename = url.replace(/^.*[\\/]/, '');
      const extension = filename.match(/\.([0-9a-z]+)(?:[?#]|$)/i)?.[1];

      const mimeType = extension ? mime.getType(extension) : null;
      let contentType = mimeType;
      if (contentType?.startsWith('text') || contentType === 'application/javascript') {
        contentType += '; charset=utf-8';
      }

      return {
        input: path,
        filename,
        extension,
        mimeType,
        contentType,
        async text() {
          return response.text();
        },
        async json<T>() {
          return response.json() as Promise<T>;
        },
        async buffer() {
          return response.arrayBuffer();
        },
        async stream() {
          return response.body;
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

  async fetch(request: Request, options: Options = {}) {
    const requestURL = new URL(request.url);
    const path = options.toAsset ? options.toAsset(requestURL, request) : requestURL.pathname;

    const defaultCacheKey = new Request(`${requestURL.origin}/__cached_git_assets__${requestURL.pathname}${requestURL.search}`, request);
    const cacheKey = typeof options.cacheKey === 'function' ? options.cacheKey(defaultCacheKey) : (options.cacheKey ?? defaultCacheKey);

    return cache(
      request,
      this.#context,
      async () => {
        const file = await this.get(path);
        if (file) {
          return new Response(await file.stream(), {
            headers: {
              'Content-Type': file.contentType ?? 'application/octet-stream',
            },
          });
        }
      },
      {
        ...options,
        cacheKey,
      },
    );
  }
}
