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

export interface FileHandler {
  /**
   * A string containing the URL to navigate to when a file is handled. This URL must be within the navigation scope of the PWA, which is the set of URLs that the PWA can navigate to. The navigation scope of a PWA defaults to its start_url member, but can also be defined by using the scope member.
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

export interface Shortcut {
  name: string;
  short_name?: string;
  description?: string;
  url?: string;
}

export type Direction = 'auto' | 'ltr' | 'rtl';

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
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display
   */
  display?: Display;
  /**
   * The `display` member is used to determine the developer's preferred display mode for a website. It follows a process where the browser falls back to the next display mode if the requested one is not supported. In some advanced use cases, this fallback process might not be enough.
   *
   * The `display_override` member solves this by letting the developer provide a sequence of display modes that the browser will consider before using the display member. Its value is an array of display modes that are considered in-order, and the first supported display mode is applied.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display_override
   */
  display_override?: DisplayOverride[];
  /**
   * The `file_handlers` member specifies an array of objects representing the types of files an installed progressive web app (PWA) can handle.
   *
   * The `file_handlers` member is read by the browser when the PWA is installed and used to associate the application with a given set of file types at the operating system level.
   *
   * For example, a PWA can be registered to handle files that match the text/plain MIME type. Once this PWA is installed, the operating system is able to use it to handle text files, opening the PWA when the user opens a file of this type. Note that other applications may also be registered as text file handlers, and the way operating systems manage the association between file types and applications, and the way they let users choose an application to handle a given file can vary from one device to another.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/file_handlers
   */
  file_handlers?: FileHandler[];
  /**
   * The `icons` manifest member is used to specify one or more image files that define the icons to represent your web application.
   *
   * @see http://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons
   */
  icons?: Icon[];
  /**
   * The `id` manifest member is used to specify a unique identifier for your web application.
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
   *
   */
  short_name?: string;
  /**
   *
   */
  shortcuts?: Shortcut[];
  /**
   *
   */
  start_url?: string;
  /**
   *
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
}
