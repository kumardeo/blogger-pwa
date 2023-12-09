const { promises: fs, existsSync } = require("fs");
const path = require("path");
const { favicons } = require("favicons");
const merge = require("deepmerge");
const getManifest = require("./manifest.cjs");
const getYandexManifest = require("./yandex.cjs");
const getBrowserConfig = require("./browserconfig.cjs");
const getMetaTags = require("./metatags.cjs");
const getIndexHTML = require("./getIndexHTML.cjs");
const getPwaRaw = require("./pwaRaw.cjs");
const config = require("../config.cjs");

const options = merge(
  {
    version: "1.0",
    name: "My App",
    shortName: "My App Short Name",
    description: "My App description",
    direction: "auto",
    language: "en-US",
    backgroundColor: "#fff",
    themeColor: "#fff",
    display: "standalone",
    orientation: "any",
    scope: "/",
    startUrl: "/",
    preferRelatedApplications: false,
    relatedApplications: [],
    screenshotSize: "540x720",
    appleStatusBarStyle: "black-translucent",
    shortcuts: []
  },
  config
);

const createDirectory = async (directoryPath, fresh = true) => {
  if (fresh === true) {
    const exists = await fs
      .stat(directoryPath)
      .then(() => true)
      .catch(() => false);
    if (exists) {
      await fs.rm(directoryPath, { recursive: true });
    }
  }
  const result = await fs.mkdir(directoryPath, { recursive: true });
  return result;
};

const getDirectoryFiles = async (directoryPath) => {
  const exists = await fs
    .stat(directoryPath)
    .then(() => true)
    .catch(() => false);
  if (exists) {
    const fileNames = await fs.readdir(directoryPath);
    return fileNames;
  }
  return [];
};

(async () => {
  // Dynamic imports
  const { default: chalk } = await import("chalk");

  const { log } = console;

  const UPLOAD_DIR = "./uploads";
  const UPLOAD_FAVICON = `${UPLOAD_DIR}/favicon.png`;
  const UPLOAD_SCREENS = `${UPLOAD_DIR}/screenshots`;
  const DIR_APP = "./public/app";
  const DIR_ICONS = `${DIR_APP}/icons`;
  const DIR_SCREENS = `${DIR_APP}/screenshots`;
  const PATH_MANIFEST = `${DIR_APP}/manifest.json`;
  const PATH_YANDEX_MANIFEST = `${DIR_APP}/yandex-browser-manifest.json`;
  const PATH_BROWSERCONFIG = `${DIR_APP}/browserconfig.xml`;
  const PATH_PWA_SCRIPT = `${DIR_APP}/pwa.js`;
  const OUT_DIR = "./output";
  const OUT_METATAGS = `${OUT_DIR}/metatags.html`;
  const OUT_METATAGS_NO_SPLASH = `${OUT_DIR}/metatags-no-splash.html`;

  log("✨ PWA Builder by Fineshop Design");
  log(chalk.redBright("---------------------------------\n"));

  log(chalk.blue("Generating (favicons)..."));
  // Favicons
  if (!existsSync(UPLOAD_FAVICON)) {
    log(chalk.red(`  +  Favicon doesn't exist at ${UPLOAD_FAVICON}`));
    log(
      chalk.red(
        `  +  Please make sure Favicon file at ${UPLOAD_FAVICON} exists.`
      )
    );
    return;
  }

  log(chalk.green(`  +  Favicon was found at ${UPLOAD_FAVICON}`));
  const response = await favicons(UPLOAD_FAVICON, {
    background: options.backgroundColor
  });

  await createDirectory(DIR_ICONS);
  await Promise.all(
    response.images.map((image) =>
      fs.writeFile(path.join(DIR_ICONS, image.name), image.contents)
    )
  );
  response.images.forEach(({ name }) => log(chalk.magenta(`  +  ${name}`)));
  log(chalk.green(`  +  Copied favicons to ${DIR_ICONS}`));

  log(chalk.blue("\nGenerating (screenshots)..."));
  log(chalk.green(`  +  Searching for screenshots in ${UPLOAD_SCREENS}`));
  // Screenshots
  await createDirectory(DIR_SCREENS);
  const screenshots = await Promise.all(
    (await getDirectoryFiles(UPLOAD_SCREENS))
      .filter((screenshot) => screenshot.endsWith(".png"))
      .sort((a, b) => a.localeCompare(b))
      .map(async (screenshot, index) => {
        const fileName = `screen-${index + 1}.png`;
        const buffer = await fs.readFile(path.join(UPLOAD_SCREENS, screenshot));
        await fs.writeFile(path.join(DIR_SCREENS, fileName), buffer);
        return [screenshot, fileName];
      })
  );
  if (screenshots.length !== 0) {
    screenshots.forEach(([original, filename]) =>
      log(chalk.magenta(`  +  ${original} => ${filename}`))
    );
    log(chalk.green(`  +  Total Screenshots found: ${screenshots.length}`));
    log(chalk.green(`  +  Copied to ${DIR_SCREENS}`));
  } else {
    log(chalk.gray(`  +  No Screenshot was found in ${UPLOAD_SCREENS}`));
  }

  log(chalk.blue("\nGenerating (manifest.json)..."));
  // Manifest.json
  const manifest = getManifest({
    name: options.name,
    shortName: options.shortName,
    description: options.description,
    version: options.version,
    direction: options.direction,
    language: options.language,
    display: options.display,
    orientation: options.orientation,
    preferRelatedApplications: options.preferRelatedApplications,
    relatedApplications: options.relatedApplications,
    scope: options.scope,
    startUrl: options.startUrl,
    iconsPath: "./icons",
    screenshotsPath: "./screenshots",
    serviceWorker: "./serviceworker.js",
    screenshots: screenshots.map(([, name]) => name),
    screenshotSize: options.screenshotSize,
    backgroundColor: options.backgroundColor,
    themeColor: options.themeColor,
    shortcuts: options.shortcuts
  });
  await fs.writeFile(
    path.join(PATH_MANIFEST),
    JSON.stringify(manifest, null, 2)
  );
  log(chalk.green(`  +  Copied manifest.json at ${PATH_MANIFEST}`));

  log(chalk.blue("\nGenerating (yandex-browser-manifest.json)..."));
  // Yandex Manifest
  const yandexManifest = getYandexManifest({
    iconsPath: "/app/icons",
    apiVersion: 1,
    version: options.version,
    color: options.backgroundColor
  });
  await fs.writeFile(
    path.join(PATH_YANDEX_MANIFEST),
    JSON.stringify(yandexManifest, null, 2)
  );
  log(
    chalk.green(
      `  +  Copied yandex-browser-manifest.json at ${PATH_YANDEX_MANIFEST}`
    )
  );

  log(chalk.blue("\nGenerating (browserconfig.xml)..."));
  // Browser Config
  const browserConfig = getBrowserConfig({
    iconsPath: "/app/icons"
  });
  await fs.writeFile(path.join(PATH_BROWSERCONFIG), browserConfig);
  log(chalk.green(`  +  Copied browserconfig.xml at ${PATH_BROWSERCONFIG}`));

  log(chalk.blue("\nGenerating (HTML Meta Tags)..."));
  // HTML Meta Tags
  const metatagsResult = getMetaTags({
    iconsPath: "/app/icons",
    manifestPath: "/app/manifest.json",
    browserConfigPath: "/app/browserconfig.xml",
    yandexManifestPath: "/app/yandex-browser-manifest.json",
    appleStatusBarStyle: options.appleStatusBarStyle,
    appleTitle: options.name,
    applicationName: options.name,
    themeColor: options.themeColor,
    tileColor: options.themeColor
  });
  const getMetaTagsHTML = (metatags) => {
    const htmlMetaTags = `<!--[ START: PWA Meta Tags ]-->\n${metatags.join(
      "\n"
    )}\n<!--[ END: PWA Meta Tags ]-->`;
    return htmlMetaTags;
  };
  await createDirectory(OUT_DIR);

  metatagsResult.all.forEach((meta) => {
    const name = meta.length <= 40 ? meta : `${meta.substring(0, 39)}... />`;
    log(chalk.magenta(`  +  ${name}`));
  });
  const allMetaTags = getMetaTagsHTML(metatagsResult.all);
  await fs.writeFile(path.join(OUT_METATAGS), `${allMetaTags}\n`);
  log(chalk.green(`  +  Copied metatags.html at ${OUT_METATAGS}\n`));

  metatagsResult.noSplash.forEach((meta) => {
    const name = meta.length <= 40 ? meta : `${meta.substring(0, 39)}... />`;
    log(chalk.magenta(`  +  ${name}`));
  });
  const noSplashMetaTags = getMetaTagsHTML(metatagsResult.noSplash);
  await fs.writeFile(
    path.join(OUT_METATAGS_NO_SPLASH),
    `${noSplashMetaTags}\n`
  );
  log(
    chalk.green(
      `  +  Copied metatags-no-splash.html at ${OUT_METATAGS_NO_SPLASH}`
    )
  );

  const indexHTMLMetaTags = `<!--[ START: PWA Meta Tags ]-->${metatagsResult.noSplash.join(
    "\n    "
  )}\n    <script async="true" defer="true" src="/app/pwa.js" type="module"></script>\n    <!--[ END: PWA Meta Tags ]-->`;
  const indexHTMLContent = getIndexHTML(options.name, indexHTMLMetaTags);
  await fs.writeFile(path.join("./public/index.html"), `${indexHTMLContent}\n`);

  log(chalk.blue("\nGenerating (pwa.js)..."));
  const pwaRawContent = getPwaRaw({
    ...config.pwa,
    serviceWorker: "/app/serviceworker.js"
  });
  await fs.writeFile(path.join(PATH_PWA_SCRIPT), `${pwaRawContent}\n`);
  log(chalk.green(`  +  Copied pwa.js at ${PATH_PWA_SCRIPT}`));

  log("");
})();
