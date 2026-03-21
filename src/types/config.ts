import type { Manifest } from './manifest';

export interface OneSignalConfig {
  enabled?: boolean;
  appId: string;
  allowLocalhostAsSecureOrigin?: boolean;
}

export interface PWAConfig {
  logs?: boolean;
}

export interface Config {
  manifest?: Manifest;
  pwa?: PWAConfig;
  oneSignal?: OneSignalConfig;
  origin?: string;
}

export function defineConfig(config: Config): Config {
  return config;
}
