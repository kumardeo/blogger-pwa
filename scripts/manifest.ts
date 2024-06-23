import path from 'node:path';

export const getManifest = ({
  name = 'My App',
  version = '1.0',
  id = '/',
  shortName = name,
  description = name,
  direction = 'auto',
  language = 'en-US',
  orientation = 'any',
  base = undefined as string | undefined,
  startUrl = '/?utm_source=homescreen',
  scope = '/',
  display = 'standalone',
  backgroundColor = '#fff',
  themeColor = backgroundColor,
  serviceWorker = undefined as string | undefined,
  iconsPath = './icons',
  screenshotsPath = './screenshots',
  screenshots = [] as {
    src: string;
    type?: string;
    formFactor?: 'wide' | 'narrow';
  }[],
  shortcuts = [] as {
    name: string;
    shortName: string;
    description: string;
    url: string;
  }[],
  preferRelatedApplications = false,
  relatedApplications = [] as {
    id?: string;
    url: string;
    platform: string;
  }[],
} = {}) => ({
  name,
  id,
  short_name: shortName,
  description,
  version,
  dir: direction,
  lang: language,
  orientation,
  start_url: base ? new URL(startUrl, base).toString() : startUrl,
  scope: base ? new URL(scope, base).toString() : scope,
  display,
  prefer_related_applications: preferRelatedApplications === true,
  background_color: backgroundColor,
  theme_color: themeColor,
  icons: [
    {
      src: path.posix.join(iconsPath, 'favicon.ico'),
      sizes: '64x64',
      type: 'image/x-icon',
    },
    {
      src: path.posix.join(iconsPath, 'favicon-16x16.png'),
      sizes: '16x16',
      type: 'image/png',
    },
    {
      src: path.posix.join(iconsPath, 'favicon-32x32.png'),
      sizes: '32x32',
      type: 'image/png',
    },
    {
      src: path.posix.join(iconsPath, 'android-chrome-36x36.png'),
      sizes: '36x36',
      type: 'image/png',
    },
    {
      src: path.posix.join(iconsPath, 'android-chrome-48x48.png'),
      sizes: '48x48',
      type: 'image/png',
    },
    {
      src: path.posix.join(iconsPath, 'android-chrome-72x72.png'),
      sizes: '72x72',
      type: 'image/png',
    },
    {
      src: path.posix.join(iconsPath, 'android-chrome-96x96.png'),
      sizes: '96x96',
      type: 'image/png',
    },
    {
      src: path.posix.join(iconsPath, 'android-chrome-144x144.png'),
      sizes: '144x144',
      type: 'image/png',
    },
    {
      src: path.posix.join(iconsPath, 'android-chrome-192x192.png'),
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: path.posix.join(iconsPath, 'android-chrome-256x256.png'),
      sizes: '256x256',
      type: 'image/png',
    },
    {
      src: path.posix.join(iconsPath, 'android-chrome-384x384.png'),
      sizes: '384x384',
      type: 'image/png',
    },
    {
      src: path.posix.join(iconsPath, 'android-chrome-512x512.png'),
      sizes: '512x512',
      type: 'image/png',
    },
  ],
  ...(screenshots.length !== 0
    ? {
        screenshots: screenshots.map(({ src, formFactor = 'narrow', type = 'image/png' }) => ({
          src: path.posix.join(screenshotsPath, src),
          type,
          sizes: formFactor === 'narrow' ? '540x720' : '720x540',
          form_factor: formFactor,
        })),
      }
    : {}),
  ...(shortcuts.length !== 0
    ? {
        shortcuts: shortcuts
          .filter(Boolean)
          .map(
            ({
              name: shortcutName = name,
              shortName: shortcutShortName = shortcutName,
              description: shortcutDescription = shortcutName,
              url: shortcutUrl = '/',
            }) => ({
              name: shortcutName,
              short_name: shortcutShortName || shortcutName,
              description: shortcutDescription || shortcutName,
              url: base ? new URL(shortcutUrl, base) : shortcutUrl,
              icons: [
                {
                  src: path.posix.join(iconsPath, 'android-chrome-96x96.png'),
                  sizes: '96x96',
                },
              ],
            }),
          ),
      }
    : {}),
  ...(preferRelatedApplications === true
    ? {
        related_applications: relatedApplications.filter(Boolean).map(({ id = '', url = '/', platform = 'play' }) => ({
          ...(id ? { id } : undefined),
          url,
          platform,
        })),
      }
    : {}),
  ...(serviceWorker
    ? {
        serviceworker: {
          src: path.posix.join(serviceWorker),
        },
      }
    : {}),
});
