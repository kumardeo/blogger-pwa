import fs from 'node:fs';
import path from 'node:path';
import arg from 'arg';
import clc from 'console-log-colors';
import merge from 'deepmerge';
import { build } from 'esbuild';
import { favicons } from 'favicons';
import { injectManifest } from 'workbox-build';
import metadata from '../metadata.json';
import USER_CONFIG from '../pwa.config';
import type { Config } from '../types';
import { getBrowserConfig } from './browserconfig';
import { getIndexHTML } from './html';
import { getManifest } from './manifest';
import { getMetaTags } from './metatags';
import { getOfflineHTML } from './offline';
import { createDirectory, existsPath, getDirectoryFiles } from './utils';
import { getYandexManifest } from './yandex';

const args = arg(
  {
    '--repository': String,
    '--branch': String,
  },
  { argv: process.argv.slice(2) },
);

const GITHUB_REPO = args['--repository'] ?? metadata.github?.repository ?? 'kumardeo/blogger-pwa';
const GITHUB_BRANCH = args['--branch'] ?? metadata.github?.branch ?? 'main';

const DEFAULT_CONFIG = {
  name: 'My App',
  shortName: 'My App Short Name',
  description: 'My App description',
  direction: 'auto',
  language: 'en-US',
  backgroundColor: '#fff',
  themeColor: '#fff',
  display: 'standalone',
  orientation: 'natural',
  scope: '/',
  startUrl: '/',
  preferRelatedApplications: false,
  appleStatusBarStyle: 'black-translucent',
  shortcuts: [],
} satisfies Config;

const options: Config = merge(DEFAULT_CONFIG, USER_CONFIG);

const { log } = console;

const UPLOAD_DIR = './uploads';
const UPLOAD_FAVICON = `${UPLOAD_DIR}/favicon.png`;
const UPLOAD_SCREENS_DIR = `${UPLOAD_DIR}/screenshots`;
const UPLOAD_SCREENS_NARROW = `${UPLOAD_SCREENS_DIR}/narrow`;
const UPLOAD_SCREENS_WIDE = `${UPLOAD_SCREENS_DIR}/wide`;
const BUCKET_DIR = './bucket';
const METADATA_PATH = './metadata.json';
const APP_DIR = `${BUCKET_DIR}/app`;
const APP_ICONS_DIR = `${APP_DIR}/icons`;
const APP_SCREENS_DIR = `${APP_DIR}/screenshots`;
const APP_MANIFEST = `${APP_DIR}/manifest.webmanifest`;
const APP_CDN_MANIFEST = `${APP_DIR}/manifest.cdn.webmanifest`;
const APP_YANDEX = `${APP_DIR}/yandex-browser-manifest.json`;
const APP_BROWSERCONFIG = `${APP_DIR}/browserconfig.xml`;
const APP_PWA_JS = `${APP_DIR}/pwa.js`;
const APP_SERVICEWORKER_JS = `${APP_DIR}/serviceworker.js`;
const OUT_DIR = './output';
const OUT_METATAGS = `${OUT_DIR}/pwa-metatags.html`;
const OUT_CDN_METATAGS = `${OUT_DIR}/cdn-metatags.html`;
const OUT_METATAGS_NO_SPLASH = `${OUT_DIR}/pwa-metatags-no-splash.html`;
const OUT_CDN_METATAGS_NO_SPLASH = `${OUT_DIR}/cdn-metatags-no-splash.html`;
const INDEX_HTML = `${BUCKET_DIR}/index.html`;
const OFFLINE_HTML = `${APP_DIR}/offline/index.html`;

log('✨ Blogger PWA Builder by Fineshop Design');
log(clc.redBright('-----------------------------------------\n'));

/* Write metadata ts */
log(clc.blue('Generating (metadata)...'));
const updatedMetadata: typeof metadata = {
  github: {
    repository: GITHUB_REPO,
    branch: GITHUB_BRANCH,
  },
};
await fs.promises.writeFile(METADATA_PATH, `${JSON.stringify(updatedMetadata, null, 2)}\n`, 'utf-8');
log(clc.green(`  +  Copied metadata.json at ${METADATA_PATH}`));

/* Write favicons */
log(clc.blue('\nGenerating (favicons)...'));
if (!(await existsPath(UPLOAD_FAVICON))) {
  log(clc.red(`  +  Favicon doesn't exist at ${UPLOAD_FAVICON}`));
  log(clc.red(`  +  Please make sure Favicon file at ${UPLOAD_FAVICON} exists.`));
  process.exit(1);
}

log(clc.green(`  +  Favicon was found at ${UPLOAD_FAVICON}`));
const response = await favicons(UPLOAD_FAVICON, {
  background: options.backgroundColor,
});

await createDirectory(APP_ICONS_DIR);
await Promise.all(response.images.map((image) => fs.promises.writeFile(path.join(APP_ICONS_DIR, image.name), image.contents)));
for (const { name } of response.images) {
  log(clc.magenta(`  +  ${name}`));
}
log(clc.green(`  +  Copied favicons to ${APP_ICONS_DIR}`));

/* Write screenshots */
log(clc.blue('\nGenerating (screenshots)...'));
log(clc.green(`  +  Searching for screenshots in ${UPLOAD_SCREENS_DIR}`));
await createDirectory(APP_SCREENS_DIR);

const screenshots: {
  type: 'narrow' | 'wide';
  original: string;
  filename: string;
}[] = [];
for (const [type, directory] of [
  ['narrow', UPLOAD_SCREENS_NARROW],
  ['wide', UPLOAD_SCREENS_WIDE],
] as const) {
  const files = (await getDirectoryFiles(directory)).filter((screenshot) => screenshot.endsWith('.png')).sort((a, b) => a.localeCompare(b));
  for (const index in files) {
    const file = files[index];
    const fileName = `screen-${type}-${Number(index) + 1}.png`;
    const buffer = await fs.promises.readFile(path.join(directory, file));
    await fs.promises.writeFile(path.join(APP_SCREENS_DIR, fileName), buffer);
    screenshots.push({
      type,
      original: file,
      filename: fileName,
    });
  }
}
if (screenshots.length !== 0) {
  for (const { original, filename, type } of screenshots) {
    log(clc.magenta(`  +  ${clc.dim(`(${type})`)} ${original} => ${filename}`));
  }
  log(clc.green(`  +  Total screenshots found: ${screenshots.length}`));
  log(clc.green(`  +  Copied to ${APP_SCREENS_DIR}`));
} else {
  log(clc.gray(`  +  No screenshot was found in ${UPLOAD_SCREENS_DIR}`));
}

/* Write manifest json */
log(clc.blue('\nGenerating (manifest.webmanifest)...'));
const commonManifestOptions: Parameters<typeof getManifest>[0] = {
  id: options.id,
  name: options.name,
  shortName: options.shortName,
  description: options.description,
  direction: options.direction,
  language: options.language,
  display: options.display,
  orientation: options.orientation,
  preferRelatedApplications: options.preferRelatedApplications,
  relatedApplications: options.relatedApplications,
  scope: options.scope,
  startUrl: options.startUrl,
  iconsPath: './icons',
  screenshotsPath: './screenshots',
  screenshots: screenshots.map(({ type, filename }) => ({
    formFactor: type,
    src: filename,
  })),
  backgroundColor: options.backgroundColor,
  themeColor: options.themeColor,
  shortcuts: options.shortcuts,
};
const manifest = getManifest({
  ...commonManifestOptions,
  serviceWorker: './serviceworker.js',
});
await fs.promises.writeFile(path.join(APP_MANIFEST), JSON.stringify(manifest, null, 2));
log(clc.green(`  +  Copied manifest.webmanifest at ${APP_MANIFEST}`));
// Manifest for CDN
const cdnManifest = getManifest({
  ...commonManifestOptions,
  base: options.origin,
});
await fs.promises.writeFile(path.join(APP_CDN_MANIFEST), JSON.stringify(cdnManifest, null, 2));
log(clc.green(`  +  Copied manifest.cdn.webmanifest at ${APP_CDN_MANIFEST}`));

/* Write yandex manifest json */
log(clc.blue('\nGenerating (yandex-browser-manifest.json)...'));
const yandexManifest = getYandexManifest({
  iconsPath: '/app/icons',
  apiVersion: 1,
  version: '1.0',
  color: options.backgroundColor,
});
await fs.promises.writeFile(path.join(APP_YANDEX), JSON.stringify(yandexManifest, null, 2));
log(clc.green(`  +  Copied yandex-browser-manifest.json at ${APP_YANDEX}`));

/* Write browserconfig xml */
log(clc.blue('\nGenerating (browserconfig.xml)...'));
const browserConfig = getBrowserConfig({
  iconsPath: '/app/icons',
});
await fs.promises.writeFile(path.join(APP_BROWSERCONFIG), browserConfig);
log(clc.green(`  +  Copied browserconfig.xml at ${APP_BROWSERCONFIG}`));

/* Write HTML meta tags */
log(clc.blue('\nGenerating (HTML Meta Tags)...'));
const commonMetatagsOptions = {
  iconsPath: '/app/icons',
  manifestPath: '/app/manifest.webmanifest',
  appleStatusBarStyle: options.appleStatusBarStyle,
  appleTitle: options.name,
  applicationName: options.name,
  themeColor: options.themeColor,
  tileColor: options.themeColor,
};
const metatagsResult = getMetaTags({
  ...commonMetatagsOptions,
  browserConfigPath: '/app/browserconfig.xml',
  yandexManifestPath: '/app/yandex-browser-manifest.json',
});
// HTML meta tags for CDN
const cdnMetatagsResult = getMetaTags({
  ...commonMetatagsOptions,
  iconsPath: './app/icons',
  manifestPath: './app/manifest.cdn.webmanifest',
  base: `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@${GITHUB_BRANCH}/bucket/`,
});
const getMetaTagsHTML = (metatags: string[]) => `<!--[ START: PWA Meta Tags ]-->\n${metatags.join('\n')}\n<!--[ END: PWA Meta Tags ]-->`;
await createDirectory(OUT_DIR);

for (const meta of metatagsResult.all) {
  const name = meta.length <= 40 ? meta : `${meta.substring(0, 39)}... />`;
  log(clc.magenta(`  +  ${name}`));
}
const allMetatags = getMetaTagsHTML(metatagsResult.all);
await fs.promises.writeFile(path.join(OUT_METATAGS), `${allMetatags}\n`);
log(clc.green(`  +  Copied pwa-metatags.html at ${OUT_METATAGS}`));

const cdnAllMetatags = getMetaTagsHTML(cdnMetatagsResult.all);
await fs.promises.writeFile(path.join(OUT_CDN_METATAGS), `${cdnAllMetatags}\n`);
log(clc.green(`  +  Copied cdn-metatags.html at ${OUT_CDN_METATAGS}\n`));

for (const meta of metatagsResult.noSplash) {
  const name = meta.length <= 40 ? meta : `${meta.substring(0, 39)}... />`;
  log(clc.magenta(`  +  ${name}`));
}
const noSplashMetatags = getMetaTagsHTML(metatagsResult.noSplash);
await fs.promises.writeFile(path.join(OUT_METATAGS_NO_SPLASH), `${noSplashMetatags}\n`);
log(clc.green(`  +  Copied pwa-metatags-no-splash.html at ${OUT_METATAGS_NO_SPLASH}`));

const cdnNoSplashMetatags = getMetaTagsHTML(cdnMetatagsResult.noSplash);
await fs.promises.writeFile(path.join(OUT_CDN_METATAGS_NO_SPLASH), `${cdnNoSplashMetatags}\n`);
log(clc.green(`  +  Copied cdn-metatags-no-splash.html at ${OUT_CDN_METATAGS_NO_SPLASH}`));

const htmlHeadMetaTags = `<!--[ START: PWA Meta Tags ]-->\n  ${metatagsResult.noSplash.join(
  '\n  ',
)}\n  <script async="" defer="" src="/app/pwa.js" type="module"></script>\n  <!--[ END: PWA Meta Tags ]-->`;
const indexHTMLContent = getIndexHTML(options.name, htmlHeadMetaTags);
await fs.promises.writeFile(path.join(INDEX_HTML), `${indexHTMLContent}\n`);
const offlineHTMLContent = getOfflineHTML(undefined, htmlHeadMetaTags);
await fs.promises.writeFile(path.join(OFFLINE_HTML), `${offlineHTMLContent}\n`);

/* Write pwa js */
log(clc.blue('\nGenerating (pwa.js)...'));
await build({
  entryPoints: ['./scripts/pwa/index.ts'],
  target: 'es2015',
  format: 'iife',
  bundle: true,
  minify: true,
  outfile: APP_PWA_JS,
  define: {
    __PWA_CONFIG_JSON: JSON.stringify(
      JSON.stringify(
        merge(
          {
            oneSignalEnabled: false,
            oneSignalSDK: 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js',
            oneSignalConfig: {
              appId: '<appId>',
              allowLocalhostAsSecureOrigin: true,
            },
            logs: true,
          },
          {
            ...options.pwa,
            oneSignalConfig: {
              ...options.pwa?.oneSignalConfig,
            },
            serviceWorker: {
              source: '/app/serviceworker.js',
              scope: '/',
            },
          },
        ),
      ),
    ),
  },
});
log(clc.green(`  +  Copied pwa.js at ${APP_PWA_JS}`));

/* Write serviceworker js */
log(clc.blue('\nGenerating (serviceworker.js)...'));
await build({
  entryPoints: ['./scripts/serviceworker/index.ts'],
  target: 'es2015',
  format: 'iife',
  bundle: true,
  minify: true,
  outfile: APP_SERVICEWORKER_JS,
});
log(clc.green('  +  Injecting precache manifest'));
await injectManifest({
  globDirectory: BUCKET_DIR,
  swSrc: APP_SERVICEWORKER_JS,
  swDest: APP_SERVICEWORKER_JS,
  modifyURLPrefix: {
    '': '/',
  },
  globPatterns: ['**/*.{html,css,js,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}', '**/manifest.webmanifest'],
  globIgnores: ['index.html', 'app/onesignalworker.js'],
});
log(clc.green(`  +  Copied serviceworker.js at ${APP_SERVICEWORKER_JS}`));

log('');
