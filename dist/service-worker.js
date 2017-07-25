"use strict";
function setOfCachedUrls(e) {
  return e.keys().then(function (e) {
    return e.map(function (e) {
      return e.url;
    });
  }).then(function (e) {
    return new Set(e);
  });
}var precacheConfig = [["/f3c62705ace8be0c60ae.worker.js", "8f3dc2a42b09fb5b4d590c1fe1a12ab6"], ["/index.html", "0eb81be2d590270a8bcdcf96f2e08853"], ["/static/css/main.f305ea2f.css", "004e3be6d716308ae4d8aebb27196e5b"], ["/static/js/0.f53e3b59.chunk.js", "e447da0f67fde58915f6348473fc44aa"], ["/static/js/main.9681109a.js", "8714aee4c44dbd83e336faf70466f642"]],
    cacheName = "sw-precache-v3-sw-precache-webpack-plugin-" + (self.registration ? self.registration.scope : ""),
    ignoreUrlParametersMatching = [/^utm_/],
    addDirectoryIndex = function addDirectoryIndex(e, t) {
  var n = new URL(e);return "/" === n.pathname.slice(-1) && (n.pathname += t), n.toString();
},
    cleanResponse = function cleanResponse(e) {
  return e.redirected ? ("body" in e ? Promise.resolve(e.body) : e.blob()).then(function (t) {
    return new Response(t, { headers: e.headers, status: e.status, statusText: e.statusText });
  }) : Promise.resolve(e);
},
    createCacheKey = function createCacheKey(e, t, n, r) {
  var a = new URL(e);return r && a.pathname.match(r) || (a.search += (a.search ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(n)), a.toString();
},
    isPathWhitelisted = function isPathWhitelisted(e, t) {
  if (0 === e.length) return !0;var n = new URL(t).pathname;return e.some(function (e) {
    return n.match(e);
  });
},
    stripIgnoredUrlParameters = function stripIgnoredUrlParameters(e, t) {
  var n = new URL(e);return n.hash = "", n.search = n.search.slice(1).split("&").map(function (e) {
    return e.split("=");
  }).filter(function (e) {
    return t.every(function (t) {
      return !t.test(e[0]);
    });
  }).map(function (e) {
    return e.join("=");
  }).join("&"), n.toString();
},
    hashParamName = "_sw-precache",
    urlsToCacheKeys = new Map(precacheConfig.map(function (e) {
  var t = e[0],
      n = e[1],
      r = new URL(t, self.location),
      a = createCacheKey(r, hashParamName, n, /\.\w{8}\./);return [r.toString(), a];
}));self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(cacheName).then(function (e) {
    return setOfCachedUrls(e).then(function (t) {
      return Promise.all(Array.from(urlsToCacheKeys.values()).map(function (n) {
        if (!t.has(n)) {
          var r = new Request(n, { credentials: "same-origin" });return fetch(r).then(function (t) {
            if (!t.ok) throw new Error("Request for " + n + " returned a response with status " + t.status);return cleanResponse(t).then(function (t) {
              return e.put(n, t);
            });
          });
        }
      }));
    });
  }).then(function () {
    return self.skipWaiting();
  }));
}), self.addEventListener("activate", function (e) {
  var t = new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function (e) {
    return e.keys().then(function (n) {
      return Promise.all(n.map(function (n) {
        if (!t.has(n.url)) return e.delete(n);
      }));
    });
  }).then(function () {
    return self.clients.claim();
  }));
}), self.addEventListener("fetch", function (e) {
  if ("GET" === e.request.method) {
    var t,
        n = stripIgnoredUrlParameters(e.request.url, ignoreUrlParametersMatching);(t = urlsToCacheKeys.has(n)) || (n = addDirectoryIndex(n, "index.html"), t = urlsToCacheKeys.has(n));!t && "navigate" === e.request.mode && isPathWhitelisted(["^(?!\\/__).*"], e.request.url) && (n = new URL("/index.html", self.location).toString(), t = urlsToCacheKeys.has(n)), t && e.respondWith(caches.open(cacheName).then(function (e) {
      return e.match(urlsToCacheKeys.get(n)).then(function (e) {
        if (e) return e;throw Error("The cached response that was expected is missing.");
      });
    }).catch(function (t) {
      return console.warn('Couldn\'t serve response for "%s" from cache: %O', e.request.url, t), fetch(e.request);
    }));
  }
});