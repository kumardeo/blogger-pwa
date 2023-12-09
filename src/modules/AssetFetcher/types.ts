import type { CacheOptions } from "../cache";

export type Manifest = {
  [key: string]: string;
};

export type Arg = {
  __STATIC_CONTENT_MANIFEST?: string | Manifest;
  __STATIC_CONTENT: KVNamespace;
};

export type Options = CacheOptions & {
  toAsset?: (url: URL, request: Request) => string;
};
