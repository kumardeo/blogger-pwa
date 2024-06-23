# Blogger PWA using Cloudflare Workers

Build a PWA for your Blogger Site using Cloudflare Workers and KV Store.

## Highlights

* Automation
  * Automatically updates and push changes to `bucket` and `output` directory when changes are made in `uploads` directory or `pwa.config.ts` file using Github actions.
* Automatic Generation
  * Automatically generates different size icons from single `favicon.png` and push it.
  * Automatically generates all the required files with a single config file `pwa.config.ts` and push it.
* Any Blogger Site
  * You can build PWA for your `blogspot.com` sites.

## Requirements

* A Github account.
* Prepare an icon for your blog in `.png` extension with a minimum size of `512x512`.  
  Rename the file as `favicon.png`.
* Prepare few screenshots of your webpages in `.png` extension.  
  * At least 3 screenshots for `narrow` screen devices of size `540x720`. Name them in series:  
    `screenshot-narrow-1.png`  
    `screenshot-narrow-2.png`  
    `screenshot-narrow-3.png`  
    ..and so on..
  * At least 3 screenshots for `wide` screen devices of size `720x540`. Name them in series:  
    `screenshot-narrow-1.png`  
    `screenshot-narrow-2.png`  
    `screenshot-narrow-3.png`  
    ..and so on..

## Installing PWA

There are two ways of installing PWA:

* **Using Cloudflare Workers**: Supports Offline Page and OneSignal push notification integration.
* **Using JsDelivr**: Does not support Offline Page and OneSignal push notification integration.

If your DNS is not managed by Cloudflare or you are using `blogspot.com` subdomain, you need to use the second method.

Follow the steps below based upon your choice.

### Forking

If you want to use Cloudflare Workers, you can follow the following steps otherwise skip it:

* Deploy the workers by clicking on the following button, this will **fork this repository** and deploy workers in your Cloudflare account for you:
  
  [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kumardeo/blogger-pwa)
* Note that it will fork this repository in your Github account.
* After deploying the workers, create a route:
  * Go to **Websites** section in Cloudflare Dashboard and select your domain.
  * Now go to **Workers Routes** section and then click on **Add Route** and input:</li>
  * **Routes**: `www.your-domain.com/app/*`, make sure to use your domain and subdomain.
  * **Service**: Select `blogger-pwa-kv` workers if you want to use Cloudflare KV, `blogger-pwa-github` workers if you want to fetch assets from github repository (Repository must be public).
  * **Environment**: `production`

If you don't want to use Cloudflare Worker, then follow these steps:

* [Fork this repository](https://github.com/kumardeo/blogger-pwa/fork).

### Making Changes

Now whenever you commit any changes to the repository, this will redeploy your workers automatically and push updated files.

#### Uploading Favicon

* Go to the forked repository.
* Upload your `favicon.png` that you have created earlier in `uploads` directory.

#### Uploading Screenshots

* Go to the forked repository.
* Upload your **narrow** screen preview screenshots of size `540x720` in `uploads/screenshots/narrow` directory.
* Upload your **wide** screen preview screenshots of size `720x540` in `uploads/screenshots/wide` directory.

#### Configuring App

You can now configure your PWA by making changes in `pwa.config.ts` file.

```ts
import type { Config } from '@/types';

const pwaConfig: Config = {
  version: '1.0',
  name: 'My Blog',
  shortName: 'My Blog',
  description: 'My blog description goes here...',
  direction: 'auto',
  language: 'en-US',
  backgroundColor: '#fff',
  themeColor: '#fff',
  display: 'standalone',
  orientation: 'any',
  scope: '/',
  startUrl: '/?utm_source=homescreen',
  appleStatusBarStyle: 'black-translucent',
  preferRelatedApplications: false,
  shortcuts: [
    {
      name: 'Shortcut 1',
      shortName: 'Shortcut 1',
      description: 'Shortcut 1 description goes here...',
      url: '/search/label/shortcut-1?utm_source=homescreen',
    },
    {
      name: 'Shortcut 2',
      shortName: 'Shortcut 2',
      description: 'Shortcut 2 description goes here...',
      url: '/search/label/shortcut-2?utm_source=homescreen',
    },
  ],
  pwa: {
    logs: true,
    // OneSignal is not available if you are not using cloudflare workers
    oneSignalEnabled: false,
    oneSignalConfig: {
      appId: '********-****-****-****-************',
      allowLocalhostAsSecureOrigin: true,
    },
  },
  // Please replace with your blog url if you are using CDN (JsDelivr)
  origin: 'https://my-blog.blogspot.com',
};

export default pwaConfig;
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

### Edit Blogger Theme XML

After making the all the above changes, workflows will run and it will commit new changes with a message `update: generated bucket and output`, please wait for all the jobs to complete.

Now, it's time to edit your blogger theme XML and add required codes.

* Go Blogger Dashboard. Go to Theme section.
* Click on Edit HTML.

Add the codes specified in next steps.

#### Add Meta Tags

* Find the following file in your forked repository based on conditions:
  * If you are using Cloudflare workers: `output/pwa-metatags.html` or `output/pwa-metatags-no-splash.html`
  * If you are not using Cloudflare workers: `output/cdn-metatags.html` or `output/pwa-metatags-no-splash.html`
* Copy all the contents of above file based on your selection and paste it below `<head>`, if you didn't find it, it would have been probably parsed which is `&lt;head&gt;`.
* Delete existing similar codes.

#### AMP Template

Follow these steps only if you are using an AMP template and Cloudflare Workers otherwise skip it.

* Add the following code just below the meta tags you have added in previous steps:
  
  ```html
  <script async='async' custom-element='amp-install-serviceworker' src='https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js'/>
  ```

* Paste the following codes above to `</body>`:

  ```html
  <amp-install-serviceworker data-iframe-src='/app/fallback/' layout='nodisplay' src='/app/serviceworker.js'/>
  ```

#### Non-AMP Template

Follow these steps only if you are using a Non-AMP template and Cloudflare Workers otherwise skip it.

* Add the following code just below the meta tags you have added in previous steps:

  ```html
  <!--[ Start: Progressive Web App Script ]-->
  <script async='' defer='' type='module' src='/app/pwa.js'></script>
  <!--[ End: Progressive Web App Script ]-->
  ```

Save changes, and visit your blog!

### Custom Install Button (Optional)

You may want to add a custom button on your site which shows the installation prompt on click. You can use the following css and javascript codes to create a beautiful install button.

> **Warning** You should not use it if you are using an AMP template.

1. Add the following css in Template XML just above to `</head>`:

   ```html
   <style>/*<![CDATA[*/
   /*! Custom PWA install button by Fineshop Design */
   .pwa-button{position:fixed;z-index:999;left:20px;bottom:75px;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;border-radius:50%;background:#1900ff;visibility:visible;opacity:1;transition:visibility .5s,opacity .5s}
   .pwa-button[hidden]{display:flex;visibility:hidden;opacity:0}
   .pwa-button:not([disabled])::before{content:'';position:absolute;z-index:-1;inset:0;background:inherit;border-radius:inherit;animation:1s cubic-bezier(0,0,.2,1) infinite pwa-button-ping}
   .pwa-button svg.flash{width:22px;height:22px;fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.4}
   @keyframes pwa-button-ping{75%,to{transform:scale(1.6);opacity:0}}
   /*]]>*/</style>
   ```

2. Add the following javascript just above to `</body>`:

   ```html
   <script type='module'>/*<![CDATA[*/
   /*! Custom PWA install button by Fineshop Design */
   (({button:t,onInstall:n})=>{let i=null;var e=()=>{i&&(t.disabled=!0,i.prompt().then(e=>{"accepted"===e.outcome&&o()}).finally(()=>{t.disabled=!1}),i=null)},l=e=>{e.preventDefault(),i=e,t.hidden=!1};const o=()=>{t.hidden=!0,t.removeEventListener("click",e),window.removeEventListener("beforeinstallprompt",l)};t instanceof HTMLElement&&(t.hidden=!0,t.addEventListener("click",e),window.addEventListener("beforeinstallprompt",l));const d=e=>{t instanceof HTMLElement&&o(),"function"==typeof n&&n(e),window.removeEventListener("appinstalled",d)};window.addEventListener("appinstalled",d)})({
     button: document.getElementById("app_install_button")||Object.assign(document.body.appendChild(document.createElement("button")),{hidden:!0,type:"button",className:"pwa-button",innerHTML:"<svg class='flash' viewBox='0 0 24 24'><path d='M6.08998 13.28H9.17998V20.48C9.17998 22.16 10.09 22.5 11.2 21.24L18.77 12.64C19.7 11.59 19.31 10.72 17.9 10.72H14.81V3.52002C14.81 1.84002 13.9 1.50002 12.79 2.76002L5.21998 11.36C4.29998 12.42 4.68998 13.28 6.08998 13.28Z' stroke-miterlimit='10'></path></svg>"}),
     onInstall(){
       /**
        * Do something on app installed
        * i.e. Display a Thank You message in UI
        */
     }
   });
   /*]]>*/</script>
   ```

3. Save the changes, now an install button will appear on your site.

## Purging Cache

If you are using JsDeliver then you may need to purge cache.

JsDelivr caches files on their server so if you update any file on GitHub, it will not be updated on the server instantly.  

In that case you manually need to tell JsDelivr to purge cache. You can use this JsDelivr's [Purge Cache Tool](https://www.jsdelivr.com/tools/purge) to do so.

## Caveats

If you are not using Cloudflare Workers, following features will not be available since it requires resources from same origin:

1. **Offline Page**: The app will show default interface of the web view when user is not connected to internet.
   * It is because it needs Server Worker (which cannot be registered from different origin).

2. **Push Notification**: You cannot use third party Push Notification services (i.e. OneSignal) to send push notifications from same domain of the app.
   * Push notifications are possible with Service Worker.

## Conclusion

⭐ [Star this repository](https://github.com/kumardeo/blogger-pwa) if you find it useful and working method.  
🐞 If you are facing any problem, feel free to [open an issue](https://github.com/kumardeo/blogger-pwa/issues).

## License

This project is licensed under [MIT License](/LICENSE.md).
