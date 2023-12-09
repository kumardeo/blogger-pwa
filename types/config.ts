export type Shortcut = {
  name: string;
  shortName: string;
  description: string;
  url: string;
};

export type RelatedApplicationPlatform =
  | "chrome_web_store"
  | "play"
  | "chromeos_play"
  | "webapp"
  | "windows"
  | "f-droid"
  | "amazon";

export type RelatedApplication = {
  id?: string;
  url: string;
  platform: RelatedApplicationPlatform;
};

export type Config =
  | {
      version?: string;
      name: string;
      shortName: string;
      description: string;
      direction?: "auto" | "ltr" | "rtl";
      language?: "en-US";
      backgroundColor?: `#${string}`;
      themeColor?: `#${string}`;
      display?: "fullscreen" | "standalone" | "minimal-ui" | "browser";
      orientation?: "any" | "natural" | "portrait" | "landscape";
      scope?: string;
      startUrl?: string;
      preferRelatedApplications?: boolean;
      screenshotSize?: `${number}x${number}`;
      appleStatusBarStyle?: "black-translucent" | "default" | "black";
      shortcuts?: Shortcut[];
      pwa?: {
        consoleLogs?: boolean;
        oneSignalEnabled?: boolean;
        oneSignalConfig?: {
          appId: string;
          allowLocalhostAsSecureOrigin?: boolean;
        };
      };
    }
  | {
      preferRelatedApplications?: true;
      relatedApplications?: RelatedApplication[];
    };
