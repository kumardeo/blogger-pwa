/** @type {import("./types").Config} */
const config = {
  version: "1.0",
  name: "My Blog",
  shortName: "My Blog",
  description: "My blog description goes here...",
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
      name: "My Shortcut 1",
      shortName: "My Shortcut 1",
      description: "My Shortcut 1 description goes here...",
      url: "/search/label/my-shortcut-1?utm_source=homescreen"
    },
    {
      name: "My Shortcut 2",
      shortName: "My Shortcut 2",
      description: "My Shortcut 2 description goes here...",
      url: "/search/label/my-shortcut-2?utm_source=homescreen"
    }
  ]
};

module.exports = config;
