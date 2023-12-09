export type FallbackFunctionValue = Response | undefined | null | void;

export type FallbackFunction = () =>
  | FallbackFunctionValue
  | Promise<FallbackFunctionValue>;

export type CacheOptions = Partial<{
  cache: string | Cache;
  cacheKey: (req: Request) => Request;
  defaultEtag: "strong" | "weak";
  browserTTL: number;
  edgeTTL: number;
  bypassCache: boolean;
}>;

export type CacheFunction = (
  request: Request,
  executionContext: ExecutionContext,
  fallback: FallbackFunction,
  options?: CacheOptions
) => Promise<Response | null>;
