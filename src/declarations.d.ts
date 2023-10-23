type Env = {
  readonly __STATIC_CONTENT: KVNamespace;
} & (
  | {
      readonly ENVIRONMENT: "development";
      readonly __STATIC_CONTENT_MANIFEST:
        | string
        | {
            [key: string]: string;
          };
    }
  | {
      readonly ENVIRONMENT: "production";
    }
);
