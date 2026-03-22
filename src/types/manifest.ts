/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/categories
 * @see https://github.com/w3c/manifest/wiki/Categories
 */
export type Category =
  | 'books'
  | 'business'
  | 'education'
  | 'entertainment'
  | 'finance'
  | 'fitness'
  | 'food'
  | 'games'
  | 'government'
  | 'health'
  | 'kids'
  | 'lifestyle'
  | 'magazines'
  | 'medical'
  | 'music'
  | 'navigation'
  | 'news'
  | 'personalization'
  | 'photo'
  | 'politics'
  | 'productivity'
  | 'security'
  | 'shopping'
  | 'social'
  | 'sports'
  | 'travel'
  | 'utilities'
  | 'weather';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display
 */
export type Display = 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display_override
 */
export type DisplayOverride = Display | 'tabbed' | 'window-controls-overlay';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/file_handlers
 */
export interface FileHandler {
  /**
   * A string containing the URL to navigate to when a file is handled. This URL must be within the navigation scope of the PWA, which is the set of URLs that the PWA can navigate to. The navigation scope of a PWA defaults to its `start_url` member, but can also be defined by using the `scope` member.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/file_handlers#action
   */
  action: string;

  /**
   * An object. For each property in the object:
   * - The property key is a MIME type.
   * - The property value is an array of strings representing file extensions associated with that MIME type.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/file_handlers#accept
   */
  accept: Record<string, string[]>;
}

export type IconPurpose = 'monochrome' | 'maskable' | 'any';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons
 */
export interface Icon {
  /**
   * A string that specifies the path to the icon image file. If src is relative, the path is resolved relative to the manifest file's URL. For example, the relative URL `images/icon-192x192.png` for the manifest file located at `https://example.com/manifest.json` will be resolved as `https://example.com/images/icon-192x192.png`.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons#src
   */
  src: string;

  /**
   * A string that specifies one or more sizes at which the icon file can be used. Each size is specified as `<width in pixels>x<height in pixels>`. If multiple sizes are specified, they are separated by spaces; for example, `48x48 96x96`. When multiple icons are available, browsers may select the most suitable icon for a particular display context. For raster formats like PNG, specifying the exact available sizes is recommended. For vector formats like SVG, you can use `any` to indicate scalability. If `sizes` is not specified, the selection and display of the icon may vary depending on the browser's implementation.
   *
   * Note that the format of sizes is similar to the HTML `<link>` element's sizes attribute.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons#sizes
   */
  sizes?: string;

  /**
   * A string that specifies the MIME type of the icon. The value should be in the format `image/<subtype>`, where `<subtype>` is a specific image format; for example, `image/png` indicates a PNG image. If omitted, browsers typically infer the image type from the file extension.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons#type
   */
  type?: string;

  /**
   * A case-sensitive keyword string that specifies one or more contexts in which the icon can be used by the browser or operating system. The value can be a single keyword or multiple space-separated keywords. If omitted, the browser can use the icon for any purpose.
   *
   * Browsers use these values as hints to determine where and how an icon is displayed. For example, a `monochrome` icon might be used as a badge or pinned icon with a solid fill, which is visually distinct from a full-color launch icon. With multiple keywords, say `monochrome maskable`, the browser can use the icon for any of those purposes. If an unrecognized purpose is included along with valid values (e.g., `monochrome fizzbuzz`), the icon can still be used for the valid purposes. However, if only unrecognized purposes are specified (e.g., `fizzbuzz`), then it will be ignored.
   *
   * Valid values include:
   *
   * - `monochrome`: Indicates that the icon is intended to be used as a monochrome icon with a solid fill. With this value, a browser discards the color information in the icon and uses only the alpha channel as a mask over any solid fill.
   * - `maskable`: Indicates that the icon is designed with icon masks and safe zone in mind, such that any part of the image outside the safe zone can be ignored and masked away.
   * - `any`: Indicates that the icon can be used in any context. This is the default value.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons#purpose
   */
  purpose?: IconPurpose;
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/launch_handler#client_mode
 */
export type ClientMode = 'auto' | 'focus-existing' | 'navigate-existing' | 'navigate-new';

export interface LaunchHandler {
  /**
   * A string, or comma-separated array of strings, which specifies the context in which the app should be loaded when launched. If an array of strings is provided, the first valid value is used.
   *
   * Possible values are:
   *
   * - `auto`: The user agent decides what context makes sense for the platform to load the app in. For example, `navigate-existing` might make more sense on mobile, where single app instances are commonplace, whereas `navigate-new` might make more sense in a desktop context. This is the default value used if all the provided values are invalid.
   * - `focus-existing`: If the app is already loaded in a web app client, it is brought into focus but not navigated to the launch target URL. The target URL is made available via `Window.launchQueue` to allow custom launch navigation handling to be implemented. If the app is not already loaded in a web app client, `navigate-new` behavior is used instead.
   * - `navigate-existing`: If the app is already loaded in a web app client, it is brought into focus and navigated to the specified launch target URL. The target URL is made available via `Window.launchQueue` to allow additional custom launch navigation handling to be implemented. If the app is not already loaded in a web app client, `navigate-new` behavior is used instead.
   * - `navigate-new`: The app is loaded inside a new web app client. The target URL is made available via Window.launchQueue to allow additional custom launch navigation handling to be implemented.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/launch_handler#client_mode
   */
  client_mode?: ClientMode | ClientMode[];
}

export interface NoteTaking {
  /**
   * A string representing the URL the developer would prefer the user agent to load when the user wants to take a new note via the web app. This value is a hint, and different implementations may choose to ignore it or provide it as a choice in appropriate places. The new_note_url is parsed with the app's manifest URL as its base URL and is ignored if not within the scope of the manifest.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/note_taking#new_note_url
   */
  new_note_url?: string;
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/orientation#orientation
 */
export type Orientation =
  | 'any'
  | 'natural'
  | 'portrait'
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape'
  | 'landscape-primary'
  | 'landscape-secondary';

export interface ProtocolHandler {
  /**
   * A required string containing the protocol to be handled; e.g.: `mailto`, `ms-word`, `web+jngl`.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/protocol_handlers#protocol
   */
  protocol: string;

  /**
   * Required HTTPS URL within the application scope that will handle the protocol. The `%s` token will be replaced by the URL starting with the protocol handler's scheme. If url is a relative URL, the base URL will be the URL of the manifest.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/protocol_handlers#url
   */
  url: string;
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/related_applications#platform
 * @see https://github.com/w3c/manifest/wiki/Platforms
 */
export type RelatedApplicationPlatform = 'chrome_web_store' | 'play' | 'chromeos_play' | 'webapp' | 'windows' | 'f-droid' | 'amazon';

export interface RelatedApplication {
  /**
   * A string that identifies the platform on which the application can be found. Examples include `amazon` (Amazon App Store), `play` (Google Play Store), `windows` (Windows Store), and `webapp` (for Progressive Web Apps).
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/related_applications#platform
   */
  platform: RelatedApplicationPlatform;

  /**
   * A string that represents the URL at which the platform-specific application can be found. If not specified, an id must be provided.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/related_applications#url
   */
  url?: string;

  /**
   * A string with the ID used to represent the application on the specified platform. If not specified, a url must be provided.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/related_applications#id
   */
  id?: string;
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope_extensions#type
 */
export type ScopeExtensionType = 'origin';

export interface ScopeExtension {
  /**
   * A string defining the type of scope extension. This is currently always `origin`, but future extensions may add other types.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope_extensions#type
   */
  type: ScopeExtensionType;

  /**
   * A string representing an origin that the web app wishes to extend its scope to.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope_extensions#origin
   */
  origin: string;
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/screenshots#form_factor
 */
export type ScreenshotFormFactor = 'narrow' | 'wide';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/screenshots#platform
 */
export type ScreenshotPlatform =
  | 'android'
  | 'chromeos'
  | 'ios'
  | 'ipados'
  | 'kaios'
  | 'macos'
  | 'windows'
  | 'xbox'
  | 'chrome_web_store'
  | 'itunes'
  | 'microsoft-inbox'
  | 'microsoft-store'
  | 'play';

export interface Screenshot {
  /**
   * A string that specifies the path to the image file. It has the same format as the `icons` member's `src` property.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/screenshots#src
   */
  src: string;

  /**
   * A string that specifies one or more sizes of the image. It has the same format as the icons member's sizes property.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/screenshots#sizes
   */
  sizes?: string;

  /**
   * A string that specifies the MIME type of the image. It has the same format as the icons member's type property.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/screenshots#type
   */
  type?: string;

  /**
   * A string that represents the accessible name of the screenshot object. Keep it descriptive because it can serve as alternative text for the rendered screenshot. For accessibility, it is recommended to specify this property for every screenshot.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/screenshots#label
   */
  label?: string;

  /**
   * A string that represents the screen shape of a broad class of devices to which the screenshot applies. Specify this property only when the screenshot applies to a specific screen layout. If `form_factor` is not specified, the screenshot is considered suitable for all screen types.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/screenshots#form_factor
   */
  form_factor?: ScreenshotFormFactor;

  /**
   * A string that represents the platform to which the screenshot applies. Specify this property only when the screenshot applies to a specific device or distribution platform. If `platform` is not specified, the screenshot is considered suitable for all platforms.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/screenshots#platform
   */
  platform?: ScreenshotPlatform;
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/serviceworker
 */
export interface ServiceWorker {
  /**
   * A string representing the service worker's registration scope.
   */
  scope?: string;

  /**
   * A string representing the URL to download the service worker script from.
   */
  src?: string;

  /**
   * A boolean that sets how the HTTP cache is used for service worker script resources during updates. It provides equivalent functionality to certain values of the updateViaCache option provided when a service worker is registered via JavaScript using `ServiceWorkerContainer.register()`.
   */
  use_cache?: boolean;
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target#method
 */
export type ShareTargetMethod = 'GET' | 'POST';

export interface ShareTargetParamsFile {
  /**
   * Name of the form field used to share files.
   */
  name?: string;

  /**
   * A string (or an array of strings) of accepted MIME types or file extensions.
   */
  accept?: string | string[];
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target#params
 */
export interface ShareTargetParams {
  /**
   * Name of the query parameter to use for the title of the document being shared.
   */
  title?: string;

  /**
   * Name of the query parameter to use for the title of the document being shared.
   */
  text?: string;

  /**
   * Name of the query parameter for the URL to the resource being shared.
   */
  url?: string;

  /**
   * An object (or an array of objects) defining which files are accepted by the share target.
   */
  files?: ShareTargetParamsFile | ShareTargetParamsFile[];
}

export interface ShareTarget {
  /**
   * The URL for the web share target.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target#action
   */
  action: string;

  /**
   * The encoding of the share data when a `POST` request is used. Ignored with `GET` requests.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target#enctype
   */
  enctype?: string;

  /**
   * The HTTP request method to use. Either `GET` or `POST`. Use `POST` if the shared data includes binary data like image(s), or if it changes the target app, for example, if it creates a data point like a bookmark.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target#method
   */
  method?: ShareTargetMethod;

  /**
   * An object to configure the share parameters. The object keys correspond to the `data` object in `navigator.share()`. The object values can be specified and will be used as query parameters.
   */
  params?: ShareTargetParams;
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/shortcuts
 */
export interface Shortcut {
  /**
   * A string that represents the name of the shortcut, which is displayed to users in a context menu.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/shortcuts#name
   */
  name: string;

  /**
   * An app URL that opens when the associated shortcut is activated. The URL must be within the `scope` of the web app manifest. If the value is absolute, it should be same-origin with the page that links to the manifest file. If the value is relative, it is resolved against the manifest file's URL.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/shortcuts#url
   */
  url: string;

  /**
   * A string that represents a short version of the shortcut's name. Browsers may use this in contexts where there isn't enough space to display the full name.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/shortcuts#short_name
   */
  short_name?: string;

  /**
   * A string that describes the purpose of the shortcut. Browsers may expose this information to assistive technology, such as screen readers, which can help users understand the purpose of the shortcut.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/shortcuts#description_2
   */
  description?: string;

  /**
   * An array of icon objects representing the shortcut in various contexts. This has the same format as the `icons` manifest member.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons
   */
  icons?: Icon[];
}

export type Direction = 'auto' | 'ltr' | 'rtl';

/**
 * **Non-standard**
 *
 * @see https://github.com/WICG/pwa-url-handler/blob/main/handle_links/explainer.md
 */
export type HandleLinks = 'auto' | 'preferred' | 'not-preferred';

export interface Manifest {
  /**
   * The `background_color` manifest member is used to specify an initial background color for your web application. This color appears in the application window before your application's stylesheets have loaded.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/background_color
   */
  background_color?: string;

  /**
   * The `categories` manifest member lets you specify one or more classifications for your web application. These categories help users discover your app in app stores.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/categories
   */
  categories?: Category[];

  /**
   * The `description` manifest member is used to explain the core features or functionality of your web application. This text helps users understand your app's purpose when viewing it in an app store.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/description
   */
  description?: string;

  /**
   * The `display` manifest member is used to specify your preferred display mode for the web application. The display mode determines how much of the browser UI is shown to the user when the app is launched within the context of an operating system. You can choose to show the full browser interface or hide it to provide a more app-like experience.
   *
   * A string with keyword values. If not specified, the default value browser is used. The keyword values include:
   *
   * - `fullscreen`: Opens the app with browser UI elements hidden and uses the entirety of the available display area. Use this value for apps where fullscreen engagement is crucial and desired. For example, use it for a game app that can take up the entire screen without any browser controls visible, providing a fully immersive gaming experience.
   * - `standalone`: Opens the app to look and feel like a standalone native app. This can include the app having a different window and its own icon in the app launcher. The browser will exclude UI elements such as a URL bar but can still include other UI elements such as the status bar. For example, use it for a task manager app that opens in its own window without the browser's URL bar, while still displaying the device's status bar for battery and notifications, thereby providing an integrated experience.
   * - `minimal-ui`: Opens the app to look and feel like a standalone app but with a minimal set of UI elements for navigation. The specific elements can vary by browser but typically include navigation controls like back, forward, reload, and possibly a way to view the app's URL. Additionally, the browser may include platform-specific UI elements that provide functionality for sharing and printing content. Use this value for apps where displaying a minimal browser interface is beneficial. For example, use it for a news reading or other general reading apps that show only the essential browser controls like back and reload buttons, providing a cleaner and less distracting interface.
   * - `browser`: Opens the app in a conventional browser tab or new window, using the platform-specific convention for opening links. Use this value for apps that are designed to be used within a browser context, where full browser functionality is needed. This is the default value if no `display` mode is specified.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display
   */
  display?: Display;

  /**
   * The `display` member is used to determine the developer's preferred display mode for a website. It follows a process where the browser falls back to the next display mode if the requested one is not supported. In some advanced use cases, this fallback process might not be enough.
   *
   * The `display_override` member solves this by letting the developer provide a sequence of display modes that the browser will consider before using the display member. Its value is an array of display modes that are considered in-order, and the first supported display mode is applied.
   *
   * Display override objects are display-mode strings, the possible values are:
   *
   * - `browser`: The application opens in a conventional browser tab or new window, depending on the browser and platform. This is the default.
   * - `fullscreen`: All of the available display area is used and no user agent chrome is shown.
   * - `minimal-ui`: The application will look and feel like a standalone application with a minimal set of UI elements for controlling navigation. The elements will vary by browser.
   * - `standalone`: The application will look and feel like a standalone application. This can include the application having a different window, its own icon in the application launcher, etc. In this mode, the user agent will exclude UI elements for controlling navigation, but can include other UI elements such as a status bar.
   * - `tabbed`: The application can contain multiple application contexts inside a single OS-level window. Supporting browsers can choose how to display these contexts, but a common approach is to provide a tab bar to switch between them.
   * - `window-controls-overlay`: This display mode only applies when the application is in a separate PWA window and on a desktop operating system. The application will opt-in to the Window Controls Overlay feature, where the full window surface area will be available for the app's web content and the window control buttons (maximize, minimize, close, and other PWA-specific buttons) will appear as an overlay above the web content.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display_override
   */
  display_override?: DisplayOverride[];

  /**
   * The `file_handlers` member specifies an array of objects representing the types of files an installed progressive web app (PWA) can handle.
   *
   * The `file_handlers` member is read by the browser when the PWA is installed and used to associate the application with a given set of file types at the operating system level.
   *
   * For example, a PWA can be registered to handle files that match the `text/plain` MIME type. Once this PWA is installed, the operating system is able to use it to handle text files, opening the PWA when the user opens a file of this type. Note that other applications may also be registered as text file handlers, and the way operating systems manage the association between file types and applications, and the way they let users choose an application to handle a given file can vary from one device to another.
   *
   * An array of objects.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/file_handlers
   */
  file_handlers?: FileHandler[];

  /**
   * The `icons` manifest member is used to specify one or more image files that define the icons to represent your web application.
   *
   * An array of objects. Each object represents an icon to be used in a specific context. For example, you can add icons to represent your web app on devices with different screen sizes, for integration with various operating systems, for splash screens, or for app notifications.
   *
   * Each icon object can have one or more properties. Of these, only `src` is required.
   *
   * @see http://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons
   */
  icons?: Icon[];

  /**
   * The `id` manifest member is used to specify a unique identifier for your web application.
   *
   * A string that takes the form of a URL. The URL must be same-origin with the `start_url` of your web app. If `id` is a relative URL, it is resolved using the origin of `start_url`. Any fragment in the `id` is always ignored. If `id` is not specified or the value is invalid in any way (such as not a string, not a valid URL, not same-origin with `start_url`), the `start_url` value is used.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/id
   */
  id?: string;

  /**
   * The `launch_handler` member defines values that control the launch of a web application. Currently it can only contain a single value, `client_mode`, which specifies the context in which the app should be loaded when launched. For example, in an existing web app client containing an instance of the app, or in a new web app client. This leaves scope for more `launch_handler` values to be defined in the future.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/launch_handler
   */
  launch_handler?: LaunchHandler;

  /**
   * The `name` manifest member is used to specify the full name of your web application as it's usually displayed to users, such as in application lists or as a label for your application's icon.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/name
   */
  name?: string;

  /**
   * The `note_taking` member identifies a web app as a note-taking app and defines related information, for example a URL pointing to functionality for taking a new note. This enables operating systems to integrate the app's note taking functionality, for example including a "New note" option in the app's context menu, or providing the app as an option for taking a note in other apps.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/note_taking
   */
  note_taking?: NoteTaking;

  /**
   * The `orientation` manifest member is used to specify the default orientation for your web application. It defines how the app should be displayed when launched and during use, in relation to the device's screen orientation, particularly on devices that support multiple orientations.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/orientation
   */
  orientation?: Orientation;

  /**
   * The `prefer_related_applications` manifest member is used to provide a hint to browsers whether to prefer installing native applications specified in the related_applications manifest member over your web application.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/prefer_related_applications
   */
  prefer_related_applications?: boolean;

  /**
   * The `protocol_handlers` member specifies an array of objects that are protocols which this web app can register and handle. Protocol handlers register the application in an OS's application preferences; the registration associates a specific application with the given protocol scheme. For example, when using the protocol handler `mailto://` on a web page, registered email applications open.
   *
   * After registering a web app as a protocol handler, when a user clicks on a hyperlink with a specific scheme such as `mailto://` or `web+music://` from a browser or native app, the registered PWA would open and receive the URL.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/protocol_handlers#url
   */
  protocol_handler?: ProtocolHandler;

  /**
   * The `related_applications` manifest member is used to specify one or more applications that are related to your web application. These may be platform-specific applications or Progressive Web Apps.
   *
   * This enables you to use web APIs like `Navigator.getInstalledRelatedApps()` to check whether a platform-specific version of your web app, or your web app itself, is already installed on the device.
   *
   * The related_applications manifest member can also be used with the `prefer_related_applications` manifest member, which indicates a preference for installing either a related native application or your web application.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/related_applications
   */
  related_applications?: RelatedApplication[];

  /**
   * The `scope` manifest member is used to specify the top-level URL path that contains your web application's pages and subdirectories. When users install and use your web app, pages within scope provide an app-like interface. When users navigate to pages outside the app's scope, they still experience the app-like interface, but browsers display UI elements like the URL bar to indicate the change in context.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope
   */
  scope?: string;

  /**
   * The `scope_extensions` manifest member is used to extend the scope of a web app to include other origins. This allows multiple domains to be presented as a single web app.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope_extensions
   */
  scope_extensions?: ScopeExtension[];

  /**
   * The `screenshots` manifest member lets you specify one or more images that showcase your web application. These images help users preview your web app's interface and features in app stores.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/screenshots
   */
  screenshots?: Screenshot[];

  /**
   * The `serviceworker` member specifies a serviceworker that is Just-In-Time (JIT)-installed and registered to run a web-based payment app providing a payment mechanism for a specified payment method in a merchant website. See Web-based Payment Handler API for more details.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/serviceworker
   */
  serviceworker?: ServiceWorker;

  /**
   * The `share_target` manifest member allows installed Progressive Web Apps (PWAs) to be registered as a share target in the system's share dialog.
   *
   * Once registered and installed, a PWA that uses the Web Share Target API acts as a content sharing target, along with typical system share targets like email, messengers, and other native apps that can receive shared content.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target
   */
  share_target?: ShareTarget;

  /**
   * The `short_name` manifest member is used to specify a short name for your web application, which may be used when the full `name` is too long for the available space.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/short_name
   */
  short_name?: string;

  /**
   * The `shortcuts` manifest member is used to specify links to key tasks or pages within your web application. Browsers can use this information to create a context menu, which is typically displayed when a user interacts with the web app's icon.
   *
   * An array of objects. Each object represents a key task or page in the web app.
   *
   * Each object can have one or more properties. Of these, only `name` and `url` are required.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/shortcuts
   */
  shortcuts?: Shortcut[];

  /**
   * The `start_url` manifest member is used to specify the URL that should be opened when a user launches your web application, such as when tapping the application's icon on their device's home screen or in an application list.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/start_url
   */
  start_url?: string;

  /**
   * The `theme_color` member is used to specify the default color for your web application's user interface. This color may be applied to various browser UI elements, such as the toolbar, address bar, and status bar. It can be particularly noticeable in contexts like the task switcher or when the app is added to the home screen.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/theme_color
   */
  theme_color?: string;

  /**
   * Not implemented
   */
  dir?: Direction;

  /**
   * Not implemented
   */
  lang?: string;

  /**
   * Not implemented
   */
  iarc_rating_id?: string;

  /**
   * **Non-standard**
   *
   * The non-standard `handle_links` manifest member indicate an app's link handling preference.
   *
   * - `auto`:  Default value if `handle_links` is not found in the manifest. The user agent may choose between `preferred` and `not-preferred`.
   * - `preferred`: The user agent should handle links using matching app clients and may promote link handling behavior.
   * - `not-preferred`: The user agent should not handle links using matching app clients and may not promote link handling behavior.
   *
   * @see https://github.com/WICG/pwa-url-handler/blob/main/handle_links/explainer.md
   */
  handle_links?: HandleLinks;
}
