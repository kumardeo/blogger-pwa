/** @type {import("./types").Config} */
const config = {
  version: "1.0",
  name: "Plus UI",
  shortName: "Plus UI",
  description: "Hello World!",
  direction: "auto",
  language: "en-US",
  backgroundColor: "#fff",
  themeColor: "#fff",
  display: "standalone",
  orientation: "any",
  scope: "/",
  startUrl: "/?utm_source=homescreen",
  screenshotSize: "540x720",
  appleStatusBarStyle: "black-translucent",
  preferRelatedApplications: false,
  shortcuts: [
    {
      name: "My Shortcut",
      shortName: "My ShortName",
      description: "My Shortcut description goes here...",
      url: "/search/label/my-shortcut.html?utm_source=homescreen"
    }
  ]
};

module.exports = config;
