declare interface Env {
  CF_ENV: 'local' | 'development' | 'production';
  __STATIC_CONTENT: KVNamespace;
}

declare interface CloudflareEnv extends Readonly<Env> {}
