if (typeof Lazy !== "function") {
  /**
   * Lazy Function by Fineshop Design
   * uses HTML5 localStorage
   *
   * License: MIT
   */
  (function(e) {
    var t = [];

    function n(e) { "function" == typeof e && (n.lazied || t.executed ? e.call(window, { type: "LOCAL_STORAGE" }) : t.push(e)) }

    function o() { 0 == document.documentElement.scrollTop && 0 == document.body.scrollTop || (t.execute({ type: "SCROLL" }), window.removeEventListener("scroll", o)) }

    function c() { t.execute({ type: "CLICK" }), document.body.removeEventListener("click", c) }

    function d() { n.lazied || t.executed || (document.body.addEventListener("click", c), window.addEventListener("scroll", o), o()), document.removeEventListener("DOMContentLoaded", d) } t.executed = !1, n.lazied = localStorage.getItem(e.key) === e.value, t.execute = function() { if (!1 === this.executed) { this.executed = !0, n.lazied = !0, localStorage.getItem(e.key) !== e.value && localStorage.setItem(e.key, e.value); for (let e = 0; e < this.length; e++) "function" == typeof this[e] && this[e].apply(window, arguments), this.splice(e, 1), e-- } }, "complete" === document.readyState || "loading" !== document.readyState || null !== document.body ? d() : document.addEventListener("DOMContentLoaded", d), this[e.name] = n
  }).call(typeof globalThis !== "undefined" ? globalThis : window, { name: "Lazy", key: "LOCAL_LAZY", value: "true" });
}

(function(app) {
  /**
   * Return from function
   * if serviceWorker is not available
   */
  if (!("serviceWorker" in navigator)) {
    return;
  }

  /**
   * Helper function to group logs
   */
  const groupLog = (title, logs) => {
    if (app.consoleLogs === true) {
      console.groupCollapsed.apply(console, Array.isArray(title) ? title : [title]);
      logs.forEach(log => console.log.apply(console, Array.isArray(log) ? log : [log]));
      console.groupEnd();
    }
  }

  /**
   * Register Workbox Service Worker
   */
  navigator.serviceWorker
    .register(app.serviceWorker, {
      scope: "/",
    })
    .then((registration) => {
      const logs = [];
      if (registration.scope) {
        logs.push(["Scope: " + registration.scope]);
      }
      if (registration.active && registration.active.scriptURL) {
        logs.push(["Script: " + registration.active.scriptURL]);
      }
      logs.push(
        ["Build by: Fineshop Design"],
        ["Developer site: https://fineshopdesign.com"]
      );

      groupLog(
        [
          "%cService Worker: Registered Successfully",
          "color: green"
        ],
        logs
      );
    })
    .catch((error) => {
      groupLog(
        [
          "%cService Worker: Registration Failed",
          "color: red"
        ],
        ["Error:", error]
      );
    });

  /**
   * Helper function to initialize OneSignal
   */
  const initializeOneSignal = (config) => (OneSignal) => {
    OneSignal.init(config)
      .then(() => {
        const logs = [
          ["Version:", OneSignal.VERSION]
        ];

        const config = OneSignal.config;
        const subscription = OneSignal.User.PushSubscription;
        const notification = OneSignal.Notifications;
        const origin = window.location.origin;

        if (config) {
          logs.push(["App ID:", config.appId]);
          logs.push(["Origin:", config.origin]);
          logs.push(["Site Name:", config.siteName]);

          const userConfig = config.userConfig;

          if (userConfig) {
            if (userConfig.serviceWorkerParam) {
              logs.push(["Scope:", origin + userConfig.serviceWorkerParam.scope]);
            }
            logs.push(["Script:", origin + userConfig.path + userConfig.serviceWorkerPath]);
          }
        }

        if (subscription.id) {
          logs.push(["Subscription ID:", subscription.id]);
        }

        logs.push(["Notification:", notification.permissionNative]);

        groupLog(
          [
            "%cOneSignal: Initialized Successfully",
            "color: green"
          ],
          logs
        );
      })
      .catch((error) => {
        groupLog(
          [
            "%cOneSignal: Initialization Failed",
            "color: red"
          ],
          ["Error:", error]
        );
      });
  };

  /**
   * Initialize OneSignal if enabled
   */
  if (app.oneSignalEnabled) {
    const oneSignalConfig = Object.assign({}, app.oneSignalConfig);
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(
      initializeOneSignal(oneSignalConfig)
    );

    /**
     * Load OneSignal SDK only if required
     * Uses Lazy to lazyload javascript for better performance
     *
     * @see https://www.fineshopdesign.com/2023/04/lazyloading-javascript.html
     */
    if (typeof OneSignal === "undefined") {
      Lazy(() => {
        const script = document.createElement("script");
        Object.assign(script, {
          src: app.oneSignalSDK,
          async: true,
          defer: true
        });
        const firstScript = document.getElementsByTagName("script")[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript);
        } else {
          document.head.appendChild(script);
        }
      });
    }
  }
})({
  "consoleLogs": true,
  "serviceWorker": "/app/serviceworker.js",
  "oneSignalEnabled": false,
  "oneSignalSDK": "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js",
  "oneSignalConfig": {
    "appId": "********-****-****-****-************",
    "allowLocalhostAsSecureOrigin": true
  }
})
