import path from 'node:path';
import type { Manifest } from './types/manifest';

export interface GetManifestOptions {
  manifest?: Manifest;
  base?: string;
  iconsBase?: string;
  screenshotsBase?: string;
}

export function getManifest(
  { manifest: { screenshots, shortcuts, ...manifest } = {}, base, iconsBase = '.', screenshotsBase = '.' }: GetManifestOptions = { manifest: {} },
): Manifest {
  return {
    ...manifest,
    ...(base
      ? {
          start_url: manifest.start_url ? new URL(manifest.start_url, base).toString() : base,
          scope: manifest.scope ? new URL(manifest.scope, base).toString() : base,
        }
      : undefined),
    icons: [
      {
        src: path.posix.join(iconsBase, 'favicon.ico'),
        sizes: '64x64',
        type: 'image/x-icon',
      },
      {
        src: path.posix.join(iconsBase, 'favicon-16x16.png'),
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: path.posix.join(iconsBase, 'favicon-32x32.png'),
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: path.posix.join(iconsBase, 'android-chrome-36x36.png'),
        sizes: '36x36',
        type: 'image/png',
      },
      {
        src: path.posix.join(iconsBase, 'android-chrome-48x48.png'),
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: path.posix.join(iconsBase, 'android-chrome-72x72.png'),
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: path.posix.join(iconsBase, 'android-chrome-96x96.png'),
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: path.posix.join(iconsBase, 'android-chrome-144x144.png'),
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: path.posix.join(iconsBase, 'android-chrome-192x192.png'),
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: path.posix.join(iconsBase, 'android-chrome-256x256.png'),
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: path.posix.join(iconsBase, 'android-chrome-384x384.png'),
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: path.posix.join(iconsBase, 'android-chrome-512x512.png'),
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    ...(screenshots && screenshots.length !== 0
      ? {
          screenshots: screenshots.map(({ src, form_factor = 'narrow', type = 'image/png' }) => ({
            src: path.posix.join(screenshotsBase, src),
            type,
            sizes: form_factor === 'narrow' ? '540x720' : '720x540',
            form_factor,
          })),
        }
      : undefined),
    ...(shortcuts && shortcuts.length !== 0
      ? {
          shortcuts: shortcuts.map((shortcut) => ({
            icons: [
              {
                src: path.posix.join(iconsBase, 'android-chrome-96x96.png'),
                sizes: '96x96',
              },
            ],
            ...shortcut,
            ...(base && shortcut.url
              ? {
                  url: new URL(shortcut.url, base).toString(),
                }
              : undefined),
          })),
        }
      : undefined),
  };
}
