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
import { getBrowserConfig } from './browserconfig';
import { DEFAULT_CONFIG } from './constants';
import { getIndexHTML } from './html';
import { type GetManifestOptions, getManifest } from './manifest';
import { type GetMetaTagsOptions, getMetaTags } from './metatags';
import { getOfflineHTML } from './offline';
import type { PWAOptions } from './pwa';
import type { Metadata } from './types/metadata';
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

const config = merge(DEFAULT_CONFIG, USER_CONFIG);

const { log } = console;

const UPLOAD_DIR = './uploads';
const UPLOAD_FAVICON_PATH = `${UPLOAD_DIR}/favicon.png`;
const UPLOAD_SCREENS_DIR = `${UPLOAD_DIR}/screenshots`;
const UPLOAD_SCREENS_NARROW_DIR = `${UPLOAD_SCREENS_DIR}/narrow`;
const UPLOAD_SCREENS_WIDE_DIR = `${UPLOAD_SCREENS_DIR}/wide`;
const BUCKET_DIR = './bucket';
const METADATA_PATH = './metadata.json';
const APP_DIR = `${BUCKET_DIR}/app`;
const APP_ICONS_DIR = `${APP_DIR}/icons`;
const APP_SCREENS_DIR = `${APP_DIR}/screenshots`;
const APP_MANIFEST_PATH = `${APP_DIR}/manifest.webmanifest`;
const APP_CDN_MANIFEST_PATH = `${APP_DIR}/manifest.cdn.webmanifest`;
const APP_YANDEX_PATH = `${APP_DIR}/yandex-browser-manifest.json`;
const APP_BROWSERCONFIG_PATH = `${APP_DIR}/browserconfig.xml`;
const APP_PWA_JS_PATH = `${APP_DIR}/pwa.js`;
const APP_SERVICEWORKER_JS_PATH = `${APP_DIR}/serviceworker.js`;
const OUT_DIR = './output';
const OUT_METATAGS_PATH = `${OUT_DIR}/pwa-metatags.html`;
const OUT_CDN_METATAGS_PATH = `${OUT_DIR}/cdn-metatags.html`;
const OUT_METATAGS_NO_SPLASH_PATH = `${OUT_DIR}/pwa-metatags-no-splash.html`;
const OUT_CDN_METATAGS_NO_SPLASH_PATH = `${OUT_DIR}/cdn-metatags-no-splash.html`;
const INDEX_HTML_PATH = `${BUCKET_DIR}/index.html`;
const OFFLINE_HTML_PATH = `${APP_DIR}/offline/index.html`;

log('✨ Blogger PWA Builder by Fineshop Design');
log(clc.redBright('-----------------------------------------\n'));

/* Write metadata ts */
log(clc.blue('Generating (metadata)...'));
const updatedMetadata: Metadata = {
  github: {
    repository: GITHUB_REPO,
    branch: GITHUB_BRANCH,
  },
};
await fs.promises.writeFile(METADATA_PATH, `${JSON.stringify(updatedMetadata, null, 2)}\n`, 'utf-8');
log(clc.green(`  +  Copied metadata.json at ${METADATA_PATH}`));

/* Write favicons */
log(clc.blue('\nGenerating (favicons)...'));
if (!(await existsPath(UPLOAD_FAVICON_PATH))) {
  log(clc.red(`  +  Favicon doesn't exist at ${UPLOAD_FAVICON_PATH}`));
  log(clc.red(`  +  Please make sure Favicon file at ${UPLOAD_FAVICON_PATH} exists.`));
  process.exit(1);
}

log(clc.green(`  +  Favicon was found at ${UPLOAD_FAVICON_PATH}`));
const response = await favicons(UPLOAD_FAVICON_PATH, {
  background: config.manifest.background_color,
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
  ['narrow', UPLOAD_SCREENS_NARROW_DIR],
  ['wide', UPLOAD_SCREENS_WIDE_DIR],
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
const commonManifestOptions: GetManifestOptions = {
  manifest: {
    ...config.manifest,
    screenshots: screenshots.map(({ type, filename }) => ({
      src: filename,
      form_factor: type,
    })),
  },
  iconsBase: './icons',
  screenshotsBase: './screenshots',
};
const manifest = getManifest(commonManifestOptions);
await fs.promises.writeFile(path.join(APP_MANIFEST_PATH), JSON.stringify(manifest, null, 2));
log(clc.green(`  +  Copied manifest.webmanifest at ${APP_MANIFEST_PATH}`));
// Manifest for CDN
const cdnManifest = getManifest({
  ...commonManifestOptions,
  base: config.origin,
});
await fs.promises.writeFile(path.join(APP_CDN_MANIFEST_PATH), JSON.stringify(cdnManifest, null, 2));
log(clc.green(`  +  Copied manifest.cdn.webmanifest at ${APP_CDN_MANIFEST_PATH}`));

/* Write yandex manifest json */
log(clc.blue('\nGenerating (yandex-browser-manifest.json)...'));
const yandexManifest = getYandexManifest({
  iconsBase: '/app/icons',
  apiVersion: 1,
  version: '1.0',
  color: config.manifest.background_color,
});
await fs.promises.writeFile(path.join(APP_YANDEX_PATH), JSON.stringify(yandexManifest, null, 2));
log(clc.green(`  +  Copied yandex-browser-manifest.json at ${APP_YANDEX_PATH}`));

/* Write browserconfig xml */
log(clc.blue('\nGenerating (browserconfig.xml)...'));
const browserConfig = getBrowserConfig({
  iconsBase: '/app/icons',
});
await fs.promises.writeFile(path.join(APP_BROWSERCONFIG_PATH), browserConfig);
log(clc.green(`  +  Copied browserconfig.xml at ${APP_BROWSERCONFIG_PATH}`));

/* Write HTML meta tags */
log(clc.blue('\nGenerating (HTML Meta Tags)...'));
const commonMetatagsOptions: GetMetaTagsOptions = {
  iconsBase: '/app/icons',
  manifestPath: '/app/manifest.webmanifest',
  appleStatusBarStyle: 'black-translucent',
  appleTitle: config.manifest.name,
  applicationName: config.manifest.name,
  themeColor: config.manifest.theme_color,
  tileColor: config.manifest.theme_color,
};
const metatagsResult = getMetaTags({
  ...commonMetatagsOptions,
  browserConfigPath: '/app/browserconfig.xml',
  yandexManifestPath: '/app/yandex-browser-manifest.json',
});
// HTML meta tags for CDN
const cdnMetatagsResult = getMetaTags({
  ...commonMetatagsOptions,
  iconsBase: './app/icons',
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
await fs.promises.writeFile(path.join(OUT_METATAGS_PATH), `${allMetatags}\n`);
log(clc.green(`  +  Copied pwa-metatags.html at ${OUT_METATAGS_PATH}`));

const cdnAllMetatags = getMetaTagsHTML(cdnMetatagsResult.all);
await fs.promises.writeFile(path.join(OUT_CDN_METATAGS_PATH), `${cdnAllMetatags}\n`);
log(clc.green(`  +  Copied cdn-metatags.html at ${OUT_CDN_METATAGS_PATH}\n`));

for (const meta of metatagsResult.noSplash) {
  const name = meta.length <= 40 ? meta : `${meta.substring(0, 39)}... />`;
  log(clc.magenta(`  +  ${name}`));
}
const noSplashMetatags = getMetaTagsHTML(metatagsResult.noSplash);
await fs.promises.writeFile(path.join(OUT_METATAGS_NO_SPLASH_PATH), `${noSplashMetatags}\n`);
log(clc.green(`  +  Copied pwa-metatags-no-splash.html at ${OUT_METATAGS_NO_SPLASH_PATH}`));

const cdnNoSplashMetatags = getMetaTagsHTML(cdnMetatagsResult.noSplash);
await fs.promises.writeFile(path.join(OUT_CDN_METATAGS_NO_SPLASH_PATH), `${cdnNoSplashMetatags}\n`);
log(clc.green(`  +  Copied cdn-metatags-no-splash.html at ${OUT_CDN_METATAGS_NO_SPLASH_PATH}`));

const htmlHeadMetaTags = `<!--[ START: PWA Meta Tags ]-->\n  ${metatagsResult.noSplash.join(
  '\n  ',
)}\n  <script async="" defer="" src="/app/pwa.js" type="module"></script>\n  <!--[ END: PWA Meta Tags ]-->`;
const indexHTMLContent = getIndexHTML(config.manifest.name, htmlHeadMetaTags);
await fs.promises.writeFile(path.join(INDEX_HTML_PATH), `${indexHTMLContent}\n`);
const offlineHTMLContent = getOfflineHTML(undefined, htmlHeadMetaTags);
await fs.promises.writeFile(path.join(OFFLINE_HTML_PATH), `${offlineHTMLContent}\n`);

/* Write pwa js */
log(clc.blue('\nGenerating (pwa.js)...'));
const pwaOptions: PWAOptions = {
  logs: config.pwa.logs ?? true,
  oneSignal: {
    enabled: false,
    sdk: 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js',
    ...config.oneSignal,
  },
  serviceWorker: {
    source: '/app/serviceworker.js',
    scope: '/',
  },
};
await build({
  entryPoints: ['./src/pwa/index.ts'],
  target: 'es2015',
  format: 'iife',
  bundle: true,
  minify: true,
  outfile: APP_PWA_JS_PATH,
  define: {
    __OPTIONS__: JSON.stringify(JSON.stringify(pwaOptions)),
  },
});
log(clc.green(`  +  Copied pwa.js at ${APP_PWA_JS_PATH}`));

/* Write serviceworker js */
log(clc.blue('\nGenerating (serviceworker.js)...'));
await build({
  entryPoints: ['./src/service-worker/index.ts'],
  target: 'es2015',
  format: 'iife',
  bundle: true,
  minify: true,
  outfile: APP_SERVICEWORKER_JS_PATH,
});
log(clc.green('  +  Injecting precache manifest'));
await injectManifest({
  globDirectory: BUCKET_DIR,
  swSrc: APP_SERVICEWORKER_JS_PATH,
  swDest: APP_SERVICEWORKER_JS_PATH,
  modifyURLPrefix: {
    '': '/',
  },
  globPatterns: ['**/*.{html,css,js,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}', '**/manifest.webmanifest'],
  globIgnores: ['index.html', 'app/onesignalworker.js'],
});
log(clc.green(`  +  Copied serviceworker.js at ${APP_SERVICEWORKER_JS_PATH}`));

log('');
