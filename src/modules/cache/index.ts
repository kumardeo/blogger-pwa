import type { CacheFunction } from "./types";

const cache: CacheFunction = async (
  request,
  context,
  fallback,
  userOptions = {}
) => {
  const defaultOptions = {
    defaultEtag: "strong" as `strong`,
    browserTTL: null,
    edgeTTL: 2 * 60 * 60 * 24,
    bypassCache: false
  };
  const options = { ...defaultOptions, ...userOptions };

  // Helpers
  const formatETag = (entityId: string, validatorType: "weak" | "strong") => {
    let etag = entityId;
    if (!etag) return "";
    switch (validatorType) {
      case "weak": {
        if (!etag.startsWith("W/")) {
          if (etag.startsWith(`"`) && etag.endsWith(`"`)) {
            return `W/${etag}`;
          }
          return `W/"${etag}"`;
        }
        return etag;
      }
      case "strong": {
        if (etag.startsWith(`W/"`)) {
          etag = etag.replace("W/", "");
        }
        if (!etag.endsWith(`"`)) {
          etag = `"${etag}"`;
        }
        return etag;
      }
      default: {
        return "";
      }
    }
  };

  const requestMethod = request.method.toUpperCase();
  if (!["GET", "HEAD"].includes(requestMethod)) {
    throw new Error(`Request method ${requestMethod} cannot be cached`);
  }

  const requestURL = new URL(request.url);

  let cacheStorage: Cache = caches.default;
  if (options.cache instanceof Cache) {
    cacheStorage = options.cache;
  } else if (typeof options.cache === "string") {
    cacheStorage = await caches.open(options.cache);
  }
  const cacheKey =
    typeof options.cacheKey === "function"
      ? options.cacheKey(request)
      : request;

  const shouldEdgeCache = !(
    options.bypassCache ||
    options.edgeTTL === null ||
    request.method === "HEAD"
  );
  const shouldSetBrowserCache = typeof options.browserTTL === "number";

  let response: Response | null | undefined = shouldEdgeCache
    ? await cacheStorage.match(cacheKey)
    : undefined;

  if (response instanceof Response) {
    if (response.status > 300 && response.status < 400) {
      if (response.body && "cancel" in Object.getPrototypeOf(response.body)) {
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
        statusText: ""
      };

      responseInit.headers.set("Cf-Cache-Status", "HIT");

      if (response.status) {
        responseInit.status = response.status;
        responseInit.statusText = response.statusText;
      } else if (responseInit.headers.has("Content-Range")) {
        responseInit.status = 206;
        responseInit.statusText = "Partial Content";
      } else {
        responseInit.status = 200;
        responseInit.statusText = "OK";
      }
      response = new Response(response.body, responseInit);
    }
  } else {
    const fallbackResponse = await fallback();
    if (fallbackResponse instanceof Response) {
      response = fallbackResponse;
    } else {
      return null;
    }

    // Skip caching if response status code is not >= 200 and < 400
    if (response.status < 200 || response.status >= 400) {
      return response;
    }

    if (shouldEdgeCache) {
      const buffer = await response.clone().arrayBuffer();
      response.headers.set("Accept-Ranges", "bytes");
      response.headers.set("Content-Length", String(buffer.byteLength));
      // set etag before cache insertion
      if (!response.headers.has("Etag")) {
        response.headers.set(
          "Etag",
          formatETag(requestURL.pathname, options.defaultEtag)
        );
      }
      // determine Cloudflare cache behavior
      response.headers.set("Cache-Control", `max-age=${options.edgeTTL}`);
      context.waitUntil(cacheStorage.put(cacheKey, response.clone()));
      response.headers.set("CF-Cache-Status", "MISS");
    }
  }

  if (response.status === 304) {
    let etag: null | string = response.headers.get("Etag");
    if (etag) etag = formatETag(etag, options.defaultEtag);
    const ifNoneMatch = cacheKey.headers.get("If-None-Match");
    const proxyCacheStatus = response.headers.get("CF-Cache-Status");
    if (etag) {
      if (ifNoneMatch && ifNoneMatch === etag && proxyCacheStatus === "MISS") {
        response.headers.set("CF-Cache-Status", "EXPIRED");
      } else {
        response.headers.set("CF-Cache-Status", "REVALIDATED");
      }
      response.headers.set("Etag", formatETag(etag, "weak"));
    }
  }
  if (shouldSetBrowserCache) {
    response.headers.set("Cache-Control", `max-age=${options.browserTTL}`);
  } else {
    response.headers.delete("Cache-Control");
  }
  return response;
};

export default cache;
export * from "./types";
