"use strict";(()=>{var g=JSON.parse('{"github":{"repository":"si99pro/blogger-pwa","branch":"main"},"pwa":{"oneSignalEnabled":false,"oneSignalSDK":"https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js","oneSignalConfig":{"appId":"********-****-****-****-************","allowLocalhostAsSecureOrigin":true},"logs":true,"serviceWorker":{"source":"/app/serviceworker.js","scope":"/"}},"build":{"hash":"aUjQym-MUZXz1g2cuTzg4"}}');var l="IS_LAZIED",d="true",u=["scroll","click"],f=["keydown","mouseover","touchmove","touchstart"],m=[...u,...f],S=new Promise(i=>{function n(){try{return localStorage.getItem(l)===d}catch(r){return!0}}function o(r=!0){try{r?localStorage.setItem(l,d):localStorage.removeItem(l)}catch(t){}}function e(r){o(!0),i({type:r.type.toLowerCase()});for(let t of m)window.removeEventListener(t,e)}if(n())i({type:"local"});else if(document.documentElement.scrollTop!==0||document.body&&document.body.scrollTop!==0)e({type:"scroll"});else{let r=()=>{window.removeEventListener("load",r);for(let t of f)window.addEventListener(t,e)};window.addEventListener("load",r);for(let t of u)window.addEventListener(t,e)}});var s=g.pwa,a=(i,n)=>{if(s.logs){console.groupCollapsed.apply(console,Array.isArray(i)?i:[i]);for(let o of n)console.log.apply(console,Array.isArray(o)?o:[o]);console.groupEnd()}};if("serviceWorker"in navigator){navigator.serviceWorker.register(s.serviceWorker.source,{scope:s.serviceWorker.scope}).then(n=>{var e;let o=[];n.scope&&o.push([`Scope: ${n.scope}`]),(e=n.active)!=null&&e.scriptURL&&o.push([`Script:  ${n.active.scriptURL}`]),o.push(["Build by: Fineshop Design"],["Developer site: https://fineshopdesign.com"]),a(["%cService Worker: Registered Successfully","color: green"],o)}).catch(n=>{a(["%cService Worker: Registration Failed","color: red"],["Error:",n])});let i=n=>o=>{o.init(n).then(()=>{let e=[["Version:",o.VERSION]],r=o.config,t=o.User.PushSubscription,h=o.Notifications,p=window.location.origin;if(r){e.push(["App ID:",r.appId]),e.push(["Origin:",r.origin]),e.push(["Site Name:",r.siteName]);let c=r.userConfig;c&&(c.serviceWorkerParam&&e.push(["Scope:",p+c.serviceWorkerParam.scope]),e.push(["Script:",p+c.path+c.serviceWorkerPath]))}t.id&&e.push(["Subscription ID:",t.id]),e.push(["Notification:",h.permissionNative]),a(["%cOneSignal: Initialized Successfully","color: green"],e)}).catch(e=>{a(["%cOneSignal: Initialization Failed","color: red"],["Error:",e])})};if(s.oneSignalEnabled){let n=Object.assign({},s.oneSignalConfig);window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(i(n)),typeof OneSignal=="undefined"&&S.then(()=>{let o=document.createElement("script");o.src=s.oneSignalSDK,o.async=!0,o.defer=!0;let e=document.getElementsByTagName("script")[0];e!=null&&e.parentNode?e.parentNode.insertBefore(o,e):document.head.appendChild(o)})}}})();
