export type Shortcut = {
  name: string;
  shortName: string;
  description: string;
  url: string;
};

export type RelatedApplicationPlatform = 'chrome_web_store' | 'play' | 'chromeos_play' | 'webapp' | 'windows' | 'f-droid' | 'amazon';

export type RelatedApplication = {
  id?: string;
  url: string;
  platform: RelatedApplicationPlatform;
};

export type OneSignalConfig = {
  appId: string;
  allowLocalhostAsSecureOrigin?: boolean;
};

export type PWAConfig = {
  logs?: boolean;
  oneSignalEnabled?: boolean;
  oneSignalConfig?: OneSignalConfig;
};

export type Config = {
  version?: string;
  id?: string;
  name: string;
  shortName: string;
  description: string;
  direction?: 'auto' | 'ltr' | 'rtl';
  language?: 'en-US';
  backgroundColor?: `#${string}`;
  themeColor?: `#${string}`;
  display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation?: 'any' | 'natural' | 'portrait' | 'landscape';
  scope?: string;
  startUrl?: string;
  appleStatusBarStyle?: 'black-translucent' | 'default' | 'black';
  shortcuts?: Shortcut[];
  pwa?: PWAConfig;
  preferRelatedApplications?: boolean;
  relatedApplications?: RelatedApplication[];
  origin?: string;
};
