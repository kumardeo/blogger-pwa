/**
 * This is auto generated metadata file, generated at: Tue Jun 25 2024 14:22:09 GMT+0000 (Coordinated Universal Time)
 * Prevent making any changes here
 */

export interface Metadata {
  github: {
    repository: string;
    branch: string;
  };
  pwa: {
    logs: boolean;
    serviceWorker: string;
    oneSignalEnabled: boolean;
    oneSignalSDK: string;
    oneSignalConfig: {
      appId: string;
      allowLocalhostAsSecureOrigin: boolean;
    };
  };
  build: {
    hash: string;
  };
}

export const metadata = JSON.parse(
  '{"github":{"repository":"CodesWithSubham/blogger-pwa","branch":"CodesWithSubham-patch-1"},"pwa":{"serviceWorker":"/app/serviceworker.js","oneSignalEnabled":false,"oneSignalSDK":"https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js","oneSignalConfig":{"appId":"********-****-****-****-************","allowLocalhostAsSecureOrigin":true},"logs":true},"build":{"hash":"Eol3AkJMhdaM1jGXFNIPW"}}',
) as Metadata;
