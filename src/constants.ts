import type { Config } from './types/config';
import type { Manifest } from './types/manifest';

export const DEFAULT_MANIFEST = {
  name: 'My App',
  short_name: 'My App',
  description: 'My App description',
  dir: 'auto',
  lang: 'en-US',
  background_color: '#fff',
  theme_color: '#fff',
  display: 'standalone',
  orientation: 'natural',
  scope: '/',
  start_url: '/?utm_source=homescreen',
  prefer_related_applications: false,
} as const satisfies Manifest;

export const DEFAULT_CONFIG = {
  manifest: DEFAULT_MANIFEST,
} as const satisfies Config;
