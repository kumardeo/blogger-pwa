import { Workbox } from 'workbox-window';
import { lazy } from './lazy';

declare global {
  interface Window {
    OneSignalDeferred?: unknown[];
  }
}

declare const OneSignal: unknown;
declare const __PWA_CONFIG_JSON: string;

const config = JSON.parse(__PWA_CONFIG_JSON) as {
  logs: boolean;
  oneSignalEnabled: boolean;
  oneSignalSDK: string;
  oneSignalConfig: {
    appId: string;
    allowLocalhostAsSecureOrigin: boolean;
  };
  serviceWorker: {
    source: string;
    scope: string;
  };
};

export const groupLog = (title: string | string[], logs: (unknown | unknown[])[]) => {
  if (config.logs) {
    console.groupCollapsed.apply(console, Array.isArray(title) ? title : [title]);
    for (const log of logs) {
      console.log.apply(console, Array.isArray(log) ? log : [log]);
    }
    console.groupEnd();
  }
};

if ('serviceWorker' in navigator) {
  /** Register Workbox Service Worker */
  const workbox = new Workbox(config.serviceWorker.source, {
    scope: config.serviceWorker.scope,
  });

  workbox
    .register({ immediate: true })
    .then((registration) => {
      const logs: string[][] = [];
      if (registration?.scope) {
        logs.push([`Scope: ${registration.scope}`]);
      }
      if (registration?.active?.scriptURL) {
        logs.push([`Script:  ${registration.active.scriptURL}`]);
      }
      logs.push(['Build by: Fineshop Design (https://fineshopdesign.com)']);

      groupLog(['%c[sw] Registered successfully', 'color: green'], logs);
    })
    .catch((error) => {
      groupLog(['%c[sw] Registration failed', 'color: red'], ['Error:', error]);
    });

  /** Helper function to initialize OneSignal */
  // biome-ignore lint/suspicious/noExplicitAny: we needed to use any here
  const initializeOneSignal = (oneSignalConfig: any) => (OneSignal: any) => {
    OneSignal.init(oneSignalConfig)
      .then(() => {
        const logs = [['Version:', OneSignal.VERSION]];

        const config = OneSignal.config;
        const subscription = OneSignal.User.PushSubscription;
        const notification = OneSignal.Notifications;
        const origin = window.location.origin;

        if (config) {
          logs.push(['App ID:', config.appId]);
          logs.push(['Origin:', config.origin]);
          logs.push(['Site Name:', config.siteName]);

          const userConfig = config.userConfig;

          if (userConfig) {
            if (userConfig.serviceWorkerParam) {
              logs.push(['Scope:', origin + userConfig.serviceWorkerParam.scope]);
            }
            logs.push(['Script:', origin + userConfig.path + userConfig.serviceWorkerPath]);
          }
        }

        if (subscription.id) {
          logs.push(['Subscription ID:', subscription.id]);
        }

        logs.push(['Notification:', notification.permissionNative]);

        groupLog(['%c[onesignal] Initialized successfully', 'color: green'], logs);
      })
      .catch((error: unknown) => {
        groupLog(['%c[onesignal] Initialization failed', 'color: red'], ['Error:', error]);
      });
  };

  /** Initialize OneSignal if enabled */
  if (config.oneSignalEnabled) {
    const oneSignalConfig = Object.assign({}, config.oneSignalConfig);
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(initializeOneSignal(oneSignalConfig));

    /**
     * Load OneSignal SDK only if required
     * Also lazy-loads javascript for better performance
     */
    if (typeof OneSignal === 'undefined') {
      lazy.then(() => {
        const script = document.createElement('script');
        script.src = config.oneSignalSDK;
        script.async = true;
        script.defer = true;
        const firstScript = document.getElementsByTagName('script')[0] as HTMLScriptElement | undefined;
        if (firstScript?.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript);
        } else {
          document.head.appendChild(script);
        }
      });
    }
  }
}
