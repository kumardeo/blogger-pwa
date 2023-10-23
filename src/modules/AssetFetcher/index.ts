import mime from "mime";
import merge from "deepmerge";
// eslint-disable-next-line import/no-unresolved
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
import type {
  Arg,
  DefaultCacheOptions,
  DefaultServeOptions,
  Manifest,
  Options
} from "./types";

const defaultCacheControl: DefaultCacheOptions = {
  browserTTL: null,
  edgeTTL: 2 * 60 * 60 * 24,
  bypassCache: false
};

const defaultServeOptions: DefaultServeOptions = {
  toAsset: null,
  cacheControl: defaultCacheControl,
  defaultMimeType: "text/plain",
  defaultETag: "strong"
};

class AssetFetcher<E extends Arg> {
  private manifest: Manifest;

  private namespace: KVNamespace;

  constructor(env: E) {
    // eslint-disable-next-line no-underscore-dangle
    const manifest = manifestJSON || env.__STATIC_CONTENT_MANIFEST;
    // eslint-disable-next-line no-underscore-dangle
    const namespace = env.__STATIC_CONTENT;
    this.manifest =
      typeof manifest === "string"
        ? (JSON.parse(manifest) as Manifest)
        : manifest || {};
    this.namespace = namespace || {};
  }

  private getAssetInfo(input: URL | string, defaultType = "text/plain") {
    const path =
      (input instanceof URL ? input.pathname : input).replace(/^\/+/, "") ||
      "/";
    let filePath: string | null = null;
    if (Object.prototype.hasOwnProperty.call(this.manifest, path)) {
      filePath = path;
    } else if (path.endsWith("/")) {
      const otherPaths = Object.keys(this.manifest)
        .filter((key) =>
          new RegExp(
            `^${path === "/" ? "" : path}(/)?index.[a-zA-Z0-9]+$`
          ).test(key)
        )
        .sort((a, b) => {
          if (a.endsWith(".html")) return -1;
          if (b.endsWith(".html")) return 1;
          return a.localeCompare(b);
        });

      if (
        otherPaths.length > 0 &&
        Object.prototype.hasOwnProperty.call(this.manifest, otherPaths[0])
      ) {
        filePath = otherPaths[0];
      }
    }
    if (filePath) {
      const fileName = filePath.replace(/^.*[\\/]/, "");
      const extensionMatches = fileName.match(/\.([0-9a-z]+)(?:[?#]|$)/i);
      const extension =
        extensionMatches && extensionMatches[1] ? extensionMatches[1] : null;

      let fileType = (extension && mime.getType(extension)) || defaultType;
      if (
        fileType.startsWith("text") ||
        fileType === "application/javascript"
      ) {
        fileType += "; charset=utf-8";
      }
      return {
        input: path,
        path: filePath,
        key: this.manifest[filePath],
        name: fileName,
        extension,
        type: fileType
      };
    }
    return null;
  }

  has(input: URL | string) {
    return this.getAssetInfo(input) !== null;
  }

  async fetch(input: URL | string) {
    const assetInfo = this.getAssetInfo(input);
    if (assetInfo) {
      const arrayBuffer = await this.namespace.get(
        assetInfo.key,
        "arrayBuffer"
      );
      if (arrayBuffer) {
        return new File([arrayBuffer], assetInfo.name, {
          type: assetInfo.type
        });
      }
    }

    return null;
  }

  async serve(request: Request, ctx: ExecutionContext, options?: Options) {
    if (!["GET", "HEAD"].includes(request.method)) {
      return null;
    }
    const config = options
      ? merge(defaultServeOptions, options)
      : defaultServeOptions;
    const cache: Cache = caches.default;

    const url = new URL(request.url);
    const path = config.toAsset ? config.toAsset(url, request) : url.pathname;
    const cacheKey = new Request(request.url, request);

    const formatETag = (
      entityId: string | null = path,
      validatorType: string = config.defaultETag
    ) => {
      if (!entityId) {
        return "";
      }
      switch (validatorType) {
        case "weak":
          if (!entityId.startsWith("W/")) {
            if (entityId.startsWith(`"`) && entityId.endsWith(`"`)) {
              return `W/${entityId}`;
            }
            return `W/"${entityId}"`;
          }
          return entityId;
        case "strong": {
          let modId = entityId.startsWith(`W/"`)
            ? entityId.replace("W/", "")
            : entityId;
          if (!modId.endsWith(`"`)) {
            modId = `"${entityId}"`;
          }
          return modId;
        }
        default:
          return "";
      }
    };

    const shouldEdgeCache =
      this.has(path) &&
      !(
        config.cacheControl.bypassCache ||
        config.cacheControl.edgeTTL === null ||
        request.method === "HEAD"
      );

    let response: Response | null = shouldEdgeCache
      ? (await cache.match(cacheKey)) || null
      : null;

    if (response) {
      if (response.status > 300 && response.status < 400) {
        if (response.body && "cancel" in Object.getPrototypeOf(response.body)) {
          await response.body.cancel();
        }
        response = new Response(null, response);
      } else {
        const opts = {
          headers: new Headers(response.headers),
          status: 0,
          statusText: ""
        };

        opts.headers.set("cf-cache-status", "HIT");

        if (response.status) {
          opts.status = response.status;
          opts.statusText = response.statusText;
        } else if (opts.headers.has("Content-Range")) {
          opts.status = 206;
          opts.statusText = "Partial Content";
        } else {
          opts.status = 200;
          opts.statusText = "OK";
        }
        response = new Response(response.body, opts);
      }
    } else {
      const file = await this.fetch(path);
      if (file) {
        response = new Response(file);
        if (shouldEdgeCache) {
          response.headers.set("Accept-Ranges", "bytes");
          response.headers.set("Content-Length", file.size.toString());
          if (!response.headers.has("etag")) {
            response.headers.set("etag", formatETag(path));
          }
          response.headers.set(
            "Cache-Control",
            `max-age=${config.cacheControl.edgeTTL}`
          );
          ctx.waitUntil(cache.put(cacheKey, response.clone()));
          response.headers.set("CF-Cache-Status", "MISS");
        }
      }
    }
    if (response) {
      if (response.status === 304) {
        const etag = formatETag(response.headers.get("etag"));
        const ifNoneMatch = cacheKey.headers.get("if-none-match");
        const proxyCacheStatus = response.headers.get("CF-Cache-Status");
        if (etag) {
          if (
            ifNoneMatch &&
            ifNoneMatch === etag &&
            proxyCacheStatus === "MISS"
          ) {
            response.headers.set("CF-Cache-Status", "EXPIRED");
          } else {
            response.headers.set("CF-Cache-Status", "REVALIDATED");
          }
          response.headers.set("etag", formatETag(etag, "weak"));
        }
      }
      if (typeof config.cacheControl.browserTTL === "number") {
        response.headers.set(
          "Cache-Control",
          `max-age=${config.cacheControl.browserTTL}`
        );
      } else {
        response.headers.delete("Cache-Control");
      }
    }
    return response;
  }
}

export default AssetFetcher;
export type * from "./types";
