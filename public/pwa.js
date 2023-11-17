if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/app/serviceworker.js", {
        scope: "/"
      })
      .then((registration) => {
        console.groupCollapsed(
          "%cPWA: Service Worker Registered",
          "color: green"
        );
        if (registration.scope) {
          console.log("Scope: " + registration.scope);
        }
        if (registration.active && registration.active.scriptURL) {
          console.log("Script: " + registration.active.scriptURL);
        }
        console.log("Build by: Fineshop Design");
        console.log("Developer site: https://fineshopdesign.com");
        console.groupEnd();
      })
      .catch((error) => {
        console.groupCollapsed("%cService Worker: Failed", "color: red");
        console.log("Error: ", error);
      });
  });
}
