const { promises: fs, existsSync } = require("fs");
const path = require("path");
const { favicons } = require("favicons");
const merge = require("deepmerge");
const getManifest = require("./manifest.cjs");
const getYandexManifest = require("./yandex.cjs");
const getBrowserConfig = require("./browserconfig.cjs");
const getMetaTags = require("./metatags.cjs");
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

  log("✨ PWA Builder by Fineshop Design");
  log(chalk.redBright("---------------------------------\n"));

  log(chalk.blue("Generating (favicons)..."));
  // Favicons
  if (!existsSync("./uploads/favicon.png")) {
    log(chalk.red("  +  Favicon doesn't exist at ./uploads/favicon.png"));
    log(
      chalk.red("  +  Please add a favicon.png file in ./uploads directory.")
    );
    return;
  }

  log(chalk.green(`  +  favicon.png was found in ./uploads`));
  const response = await favicons("./uploads/favicon.png", {
    background: options.backgroundColor
  });
  response.images.forEach(({ name }) => log(chalk.magenta(`  +  ${name}`)));
  log(chalk.green("  +  Copied favicons to ./public/icons"));
  await createDirectory("./public/icons");
  await Promise.all(
    response.images.map((image) =>
      fs.writeFile(path.join("./public/icons", image.name), image.contents)
    )
  );

  log(chalk.blue("\nGenerating (screenshots)..."));
  // Screenshots
  await createDirectory("./public/screenshots");
  const screenshotsDir = "./uploads/screenshots";
  const screenshots = await Promise.all(
    (await getDirectoryFiles(screenshotsDir))
      .filter((screenshot) => screenshot.endsWith(".png"))
      .sort((a, b) => a.localeCompare(b))
      .map(async (screenshot, index) => {
        const fileName = `screen-${index + 1}.png`;
        const buffer = await fs.readFile(path.join(screenshotsDir, screenshot));
        await fs.writeFile(path.join("./public/screenshots", fileName), buffer);
        return [screenshot, fileName];
      })
  );
  log(chalk.green("  +  Searching for screenshots in ./uploads/screenshots"));
  if (screenshots.length !== 0) {
    screenshots.forEach(([original, filename]) =>
      log(chalk.magenta(`  +  ${original} => ${filename}`))
    );
    log(chalk.green(`  +  Total Screenshots found: ${screenshots.length}`));
    log(chalk.green("  +  Copied to ./public/screenshots"));
  } else {
    log(chalk.gray(`  +  No Screenshot was found in ./uploads/screenshots`));
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
    path.join("./public", "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  log(chalk.green("  +  Copied manifest.json to ./public"));

  log(chalk.blue("\nGenerating (yandex-browser-manifest.json)..."));
  // Yandex Manifest
  const yandexManifest = getYandexManifest({
    iconsPath: "/app/icons",
    apiVersion: 1,
    version: options.version,
    color: options.backgroundColor
  });
  await fs.writeFile(
    path.join("./public", "yandex-browser-manifest.json"),
    JSON.stringify(yandexManifest, null, 2)
  );
  log(chalk.green("  +  Copied yandex-browser-manifest.json to ./public"));

  log(chalk.blue("\nGenerating (browserconfig.xml)..."));
  // Browser Config
  const browserConfig = getBrowserConfig({
    iconsPath: "/app/icons"
  });
  await fs.writeFile(path.join("./public", "browserconfig.xml"), browserConfig);
  log(chalk.green("  +  Copied browserconfig.xml to ./public"));

  log(chalk.blue("\nGenerating (HTML Meta Tags)..."));
  // HTML Meta Tags
  const metatags = getMetaTags({
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
  metatags.forEach((meta) => {
    const name = meta.length <= 40 ? meta : `${meta.substring(0, 39)}... />`;
    log(chalk.magenta(`  +  ${name}`));
  });
  const htmlMetaTags = `<!--[ Start: Progressive Web App Meta Tags ]-->\n${metatags.join(
    "\n"
  )}\n<!--[ End: Progressive Web App Meta Tags ]-->\n`;
  await createDirectory("./output");
  await fs.writeFile(path.join("./output", "metatags.html"), htmlMetaTags);
  log(chalk.green("  +  Copied metatags.html to ./output"));

  log("");
})();
