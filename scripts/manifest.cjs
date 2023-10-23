const path = require("path");

const getManifest = ({
  name = "My App",
  version = "1.0",
  shortName = name,
  description = name,
  direction = "auto",
  language = "en-US",
  orientation = "any",
  startUrl = "/?utm_source=homescreen",
  scope = "/",
  display = "standalone",
  backgroundColor = "#fff",
  themeColor = backgroundColor,
  serviceWorker = "./serviceworker.js",
  iconsPath = ".",
  screenshotsPath = ".",
  screenshots = [],
  screenshotSize = "540x720",
  shortcuts = [],
  preferRelatedApplications = false,
  relatedApplications = []
} = {}) => ({
  name,
  short_name: shortName,
  description,
  version,
  dir: direction,
  lang: language,
  orientation,
  start_url: startUrl,
  scope,
  display,
  prefer_related_applications: preferRelatedApplications === true,
  background_color: backgroundColor,
  theme_color: themeColor,
  icons: [
    {
      src: path.posix.join(iconsPath, "favicon.ico"),
      sizes: "16x16 24x24 32x32 64x64",
      type: "image/x-icon"
    },
    {
      src: path.posix.join(iconsPath, "android-chrome-36x36.png"),
      sizes: "36x36",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: path.posix.join(iconsPath, "android-chrome-48x48.png"),
      sizes: "48x48",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: path.posix.join(iconsPath, "android-chrome-72x72.png"),
      sizes: "72x72",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: path.posix.join(iconsPath, "android-chrome-96x96.png"),
      sizes: "96x96",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: path.posix.join(iconsPath, "android-chrome-144x144.png"),
      sizes: "144x144",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: path.posix.join(iconsPath, "android-chrome-192x192.png"),
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: path.posix.join(iconsPath, "android-chrome-256x256.png"),
      sizes: "256x256",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: path.posix.join(iconsPath, "android-chrome-384x384.png"),
      sizes: "256x256",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: path.posix.join(iconsPath, "android-chrome-512x512.png"),
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    }
  ],
  ...(screenshots.length !== 0
    ? {
        screenshots: screenshots.map((screenshot) => ({
          src: path.posix.join(screenshotsPath, screenshot),
          type: "image/png",
          sizes: screenshotSize
        }))
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
              url: shortcutUrl = "/"
            } = {}) => ({
              name: shortcutName,
              short_name: shortcutShortName || shortcutName,
              description: shortcutDescription || shortcutName,
              url: shortcutUrl,
              icons: [
                {
                  src: path.posix.join(iconsPath, "android-chrome-192x192.png"),
                  sizes: "192x192"
                }
              ]
            })
          )
      }
    : {}),
  ...(preferRelatedApplications === true
    ? {
        related_applications: relatedApplications
          .filter(Boolean)
          .map(({ id = "", url = "/", platform = "play" } = {}) => ({
            ...(id ? { id } : {}),
            url,
            platform
          }))
      }
    : {}),
  ...(serviceWorker
    ? {
        serviceworker: {
          src: path.posix.join(serviceWorker)
        }
      }
    : {})
});

module.exports = getManifest;
