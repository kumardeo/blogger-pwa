export type Manifest = {
  [key: string]: string;
};

export type Arg = {
  __STATIC_CONTENT_MANIFEST?: string | Manifest;
  __STATIC_CONTENT: KVNamespace;
};

export type CacheOptions = {
  browserTTL?: number;
  edgeTTL?: number;
  bypassCache?: boolean;
};

export type Options = {
  toAsset?: (url: URL, request: Request) => string;
  path?: string;
  cacheControl?: CacheOptions;
  defaultMimeType?: string;
  defaultETag?: "strong" | "weak";
};

export type DefaultCacheOptions = {
  browserTTL: null | number;
  edgeTTL: number;
  bypassCache: boolean;
};

export type DefaultServeOptions = {
  toAsset: null | ((url: URL, request: Request) => string);
  cacheControl: DefaultCacheOptions;
  defaultMimeType: string;
  defaultETag: "strong" | "weak";
};
