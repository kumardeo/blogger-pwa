import path from 'node:path';
import { js2xml } from 'xml-js';

const getLinkElement = ({ rel = '', type = '', sizes = '', href = '', media = '' }) =>
  js2xml({
    elements: [
      {
        type: 'element',
        name: 'link',
        attributes: {
          rel: rel || null,
          media: media || null,
          sizes: sizes || null,
          type: type || null,
          href: href || null,
        },
      },
    ],
  });

const getMetaElement = ({ name = '', content = '' }) =>
  js2xml({
    elements: [
      {
        type: 'element',
        name: 'meta',
        attributes: {
          name: name || null,
          content: content || null,
        },
      },
    ],
  });

const getHref = (path: string, base?: string) => (base ? new URL(path, base).toString() : path);

const getAppleIconMetaTags = ({ iconsPath = '/', base = undefined as string | undefined } = {}) =>
  ['57x57', '60x60', '72x72', '76x76', '114x114', '120x120', '144x144', '152x152', '167x167', '180x180', '1024x1024'].map((size) =>
    getLinkElement({
      rel: 'apple-touch-icon',
      sizes: size,
      href: getHref(path.posix.join(iconsPath, `apple-touch-icon-${size}.png`), base),
    }),
  );

const getSplashScreenMetaTags = ({ screensPath = '/', base = undefined as string | undefined } = {}) =>
  [
    {
      width: 320,
      height: 568,
      ratio: 2,
      size: '640x1136',
    },
    {
      width: 320,
      height: 568,
      ratio: 2,
      portrait: false,
      size: '1136x640',
    },
    {
      width: 375,
      height: 667,
      ratio: 2,
      size: '750x1334',
    },
    {
      width: 375,
      height: 667,
      ratio: 2,
      portrait: false,
      size: '1334x750',
    },
    {
      width: 375,
      height: 812,
      ratio: 3,
      size: '1125x2436',
    },
    {
      width: 375,
      height: 812,
      ratio: 3,
      portrait: false,
      size: '2436x1125',
    },
    {
      width: 390,
      height: 844,
      ratio: 3,
      size: '1170x2532',
    },
    {
      width: 390,
      height: 844,
      ratio: 3,
      portrait: false,
      size: '2532x1170',
    },
    {
      width: 414,
      height: 896,
      ratio: 2,
      size: '828x1792',
    },
    {
      width: 414,
      height: 896,
      ratio: 2,
      portrait: false,
      size: '1792x828',
    },
    {
      width: 414,
      height: 896,
      ratio: 3,
      size: '1242x2688',
    },
    {
      width: 414,
      height: 896,
      ratio: 3,
      portrait: false,
      size: '2688x1242',
    },
    {
      width: 414,
      height: 736,
      ratio: 3,
      size: '1242x2208',
    },
    {
      width: 414,
      height: 736,
      ratio: 3,
      portrait: false,
      size: '2208x1242',
    },
    {
      width: 428,
      height: 926,
      ratio: 3,
      size: '1284x2778',
    },
    {
      width: 428,
      height: 926,
      ratio: 3,
      portrait: false,
      size: '2778x1284',
    },
    {
      width: 768,
      height: 1024,
      ratio: 2,
      size: '1536x2048',
    },
    {
      width: 768,
      height: 1024,
      ratio: 2,
      portrait: false,
      size: '2048x1536',
    },
    {
      width: 810,
      height: 1080,
      ratio: 2,
      size: '1620x2160',
    },
    {
      width: 810,
      height: 1080,
      ratio: 2,
      portrait: false,
      size: '2160x1620',
    },
    {
      width: 834,
      height: 1194,
      ratio: 2,
      size: '1668x2388',
    },
    {
      width: 834,
      height: 1194,
      ratio: 2,
      portrait: false,
      size: '2388x1668',
    },
    {
      width: 834,
      height: 1112,
      ratio: 2,
      size: '1668x2224',
    },
    {
      width: 834,
      height: 1112,
      ratio: 2,
      portrait: false,
      size: '2224x1668',
    },
    {
      width: 1024,
      height: 1366,
      ratio: 2,
      size: '2048x2732',
    },
    {
      width: 1024,
      height: 1366,
      ratio: 2,
      portrait: false,
      size: '2732x2048',
    },
  ].map(({ width = 0, height = 0, ratio = 0, portrait = true, size = '640x1136' }) =>
    getLinkElement({
      rel: 'apple-touch-startup-image',
      media: `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: ${
        portrait === true ? 'portrait' : 'landscape'
      })`,
      href: getHref(path.posix.join(screensPath, `apple-touch-startup-image-${size}.png`), base),
    }),
  );

export const getMetaTags = ({
  base = undefined as string | undefined,
  iconsPath = '/app/icons',
  manifestPath = '/manifest.json',
  yandexManifestPath = undefined as string | undefined,
  browserConfigPath = undefined as string | undefined,
  themeColor = '#fff',
  applicationName = 'My App',
  appleStatusBarStyle = 'black-translucent',
  appleTitle = 'My App',
  tileColor = '#fff',
} = {}) => {
  const getIconHref = (filename: string) => getHref(path.posix.join(iconsPath, filename), base);
  const generate = (splashScreens = true) =>
    [
      getLinkElement({
        rel: 'icon',
        type: 'image/x-icon',
        href: getIconHref('favicon.ico'),
      }),
      getLinkElement({
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: getIconHref('favicon-16x16.png'),
      }),
      getLinkElement({
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: getIconHref('favicon-32x32.png'),
      }),
      getLinkElement({
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: getIconHref('favicon-48x48.png'),
      }),
      getLinkElement({
        rel: 'manifest',
        href: getHref(path.posix.join(manifestPath), base),
      }),
      getMetaElement({
        name: 'mobile-web-app-capable',
        content: 'yes',
      }),
      getMetaElement({
        name: 'theme-color',
        content: themeColor,
      }),
      getMetaElement({
        name: 'application-name',
        content: applicationName,
      }),
      ...getAppleIconMetaTags({ iconsPath, base }),
      getMetaElement({
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      }),
      getMetaElement({
        name: 'apple-mobile-web-app-status-bar-style',
        content: appleStatusBarStyle,
      }),
      getMetaElement({
        name: 'apple-mobile-web-app-title',
        content: appleTitle,
      }),
      ...(splashScreens ? getSplashScreenMetaTags({ screensPath: iconsPath, base }) : []),
      getMetaElement({
        name: 'msapplication-TileColor',
        content: tileColor,
      }),
      getMetaElement({
        name: 'msapplication-TileImage',
        content: getIconHref('mstile-144x144.png'),
      }),
      browserConfigPath &&
        getMetaElement({
          name: 'msapplication-config',
          content: getHref(path.posix.join(browserConfigPath), base),
        }),
      yandexManifestPath &&
        getLinkElement({
          rel: 'yandex-tableau-widget',
          href: getHref(path.posix.join(yandexManifestPath), base),
        }),
    ].filter(Boolean) as string[];
  return {
    all: generate(),
    noSplash: generate(false),
  };
};
