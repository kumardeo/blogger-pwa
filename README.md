# Blogger PWA using Cloudflare Workers

Build a PWA for your Blogger Site using Cloudflare Workers and KV Store.

## Full Documentation

Complete documentation is available at [fineshopdesign.com](https://www.fineshopdesign.com/2023/10/progressive-web-app.html).

### Wrangler CLI

Install Wrangler CLI globally:

```shell
npm install -g wrangler
```

Login to Wrangler CLI with your Cloudflare Account:

```shell
wrangler login
```

### Installation

Clone the Repository:

```shell
git clone https://github.com/kumardeo/blogger-pwa.git
```

Navigate to project directory:

```shell
cd blogger-pwa
```

Install Dependencies:

```shell
npm install
```

### Add Favicon

Prepare an icon for your blog in `.png` extension with a minimum size of `512x512`. Rename the file as `favicon.png`.

Replace `favicon.png` file in `uploads` directory with your `favicon.png` file.

### Add Screenshots (optional)

Prepare few screenshots of size `540x720` of your webpages in `.png` extension, it will be used as preview of your PWA and may appear when it shows the install button.

Delete existing screenshots in `uploads/screenshots` directory and add your screenshots in that directory.

### Configure App

You can configure your PWA by making changes in `config.cjs` file in the root directory.

```javascript
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
  ],
  pwa: {
    consoleLogs: true,
    oneSignalEnabled: false,
    oneSignalConfig: {
      appId: "********-****-****-****-************",
      allowLocalhostAsSecureOrigin: true
    }
  }
};

module.exports = config;
```

**Description**:

|             key             |                                      type                                      |     default value      | required | description                                                 |
| :-------------------------: | :----------------------------------------------------------------------------: | :--------------------: | :------: | :---------------------------------------------------------- |
|          `version`          |                                    `string`                                    |        `"1.0"`         |   yes    | Version of your app                                         |
|           `name`            |                                    `string`                                    |       `"My App"`       |   yes    | Name of your app (Blog name)                                |
|         `shortName`         |                                    `string`                                    | `"My App Short Name"`  |   yes    | Short name of your app                                      |
|        `description`        |                                    `string`                                    | `"My App description"` |   yes    | Description of your app                                     |
|         `direction`         |                           `"auto" \| "ltr" \| "rtl"`                           |        `"auto"`        |    no    | Direction of your app                                       |
|         `language`          |                                    `string`                                    |       `"en-US"`        |    no    | Language of your app                                        |
|      `backgroundColor`      |                                    `string`                                    |        `"#fff"`        |    no    | Background color of the app                                 |
|        `themeColor`         |                                    `string`                                    |        `"#fff"`        |    no    | Theme color of the app                                      |
|          `display`          |          `"fullscreen" \| "standalone" \| "minimal-ui" \| "browser"`           |     `"standalone"`     |    no    | Display mode of the app                                     |
|        `orientation`        |               `"any" \| "natural" \| "portrait" \| "landscape"`                |        `"any"`         |    no    | Orientation of the app                                      |
|           `scope`           |                                    `string`                                    |         `"/"`          |    no    | Scope of the app                                            |
|         `startUrl`          |                                    `string`                                    |         `"/"`          |    no    | Url to open when app is launched                            |
|      `screenshotSize`       |                                    `string`                                    |      `"540x720"`       |    no    | Size of the screenshot                                      |
|    `appleStatusBarStyle`    |                 `"black-translucent" \| "default" \| "black"`                  | `"black-translucent"`  |    no    | Content of `apple-mobile-web-app-status-bar-style` meta tag |
| `preferRelatedApplications` |                                   `boolean`                                    |        `false`         |    no    | Prefer related application or not?                          |
|         `shortcuts`         | `Array<{ name: string, shortName: string, description: string, url: string }>` |          `[]`          |    no    | List of all shortcuts of the app                            |

### Edit wrangler.toml

Now, you need to route `/app/*` to workers app in order to serve the generated static files.

To do that, open `wrangler.toml` file and replace the route.

```toml
[env.production]
routes = [
  # zone_name = "fineshopdesign.com"
  # Replace 'fineshopdesign.com' with your domain name (must be added in Cloudflare Account)
  # e.g.: zone_name = "example.com"
  #
  # pattern = "plus-ui.fineshopdesign.com/app/*"
  # Replace 'plus-ui.fineshopdesign.com' with your blogger subdomain and domain (domain name must be same as zone_name)
  # e.g.: pattern = "www.example.com/app/*"
  { pattern = "plus-ui.fineshopdesign.com/app/*", zone_name = "fineshopdesign.com", custom_domain = false }
]
```

### Deploy your Workers App

Now, your Workers app is ready to be deployed in Production mode on Cloudflare.

To deploy your app, you can run the following command in the project root directory:

```shell
npm run deploy
```

It will also generate all the required files, icons of different sizes, etc. and then upload these files to KV Store.

Once your workers app is deployed to Cloudflare, you can access your static files through the route specified in `wrangler.toml` file.

### Edit Blogger Theme XML

Now, it's time to edit your blogger theme XML and add required codes.

Go Blogger Dashboard. Go to Theme section.

Click on Edit HTML.

Add the codes specified in next steps.

#### Add Meta Tags

After deploying your workers app, a file output > metatags.html will be generated.

Copy all the contents of this file and paste it below `<head>`, if you didn't find it, it would have been probably parsed which is `&lt;head&gt;`. Delete existing similar codes.

#### AMP Template

Follow these steps only if you are using an AMP template.

Add the following code just below the meta tags you have added in previous steps:

```html
<script async='async' custom-element='amp-install-serviceworker' src='https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js'/>
```

Paste the following codes above to `</body>`:

```html
<amp-install-serviceworker data-iframe-src='/app/fallback/' layout='nodisplay' src='/app/serviceworker.js'/>
```

#### Non-AMP Template

Follow these steps only if you are using a Non-AMP template.

Add the following code just below the meta tags you have added in previous steps:

```html
<!--[ Start: Progressive Web App Script ]-->
<script async='' defer='' type='module' src='/app/pwa.js'></script>
<!--[ End: Progressive Web App Script ]-->
```

Save changes, and visit your blog!
