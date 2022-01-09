/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-c606bbca4e0557d3624b.js"
  },
  {
    "url": "framework-7357b6dab58473f763f1.js"
  },
  {
    "url": "app-44fcb6b4d6aa282d48be.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "8e595395409000aebc99cb6846fb47ac"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-b39d944fec15e3bc0224.js"
  },
  {
    "url": "page-data/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "f2c002077289a7e1ac538802bc7f5314"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "08992d06284f2f4468bde89df8de5e47"
  },
  {
    "url": "polyfill-743de0596306b5828f30.js"
  },
  {
    "url": "component---src-pages-404-js-3398b1bef5a477aa76b0.js"
  },
  {
    "url": "page-data/404/page-data.json",
    "revision": "19c62334d769f485c4795d50716183f3"
  },
  {
    "url": "page-data/404.html/page-data.json",
    "revision": "fd191c357c2cfd0a5cd21901f231596a"
  },
  {
    "url": "styles.ebf3a644adf4c5fdbfa5.css"
  },
  {
    "url": "0200114aa3f8ae7323c62e7873aaeaa1fe15b270-1faf3c8e7d910a3dde50.js"
  },
  {
    "url": "component---src-pages-childhood-diary-binned-js-3578688a58c77a447b28.js"
  },
  {
    "url": "page-data/childhood-diary-binned/page-data.json",
    "revision": "41ca7bea5eb2aeff05d4f08a1ba118ae"
  },
  {
    "url": "938108f27134c92b4aaef29fce57b35c85a89c6b-1675c62973f1a9f4dc8e.js"
  },
  {
    "url": "component---src-pages-childhood-diary-scatter-scroll-js-834cb06d183f105603fa.js"
  },
  {
    "url": "page-data/childhood-diary-scatter-scroll/page-data.json",
    "revision": "952370d499de26cae079d95a2fc6bff5"
  },
  {
    "url": "component---src-pages-childhood-diary-svg-js-bc77433dae734fdeb719.js"
  },
  {
    "url": "page-data/childhood-diary-svg/page-data.json",
    "revision": "00a514a1b79e080105a7b0f1f2a90fa0"
  },
  {
    "url": "component---src-pages-childhood-diary-swarm-js-126ea0b35ced94562fa5.js"
  },
  {
    "url": "page-data/childhood-diary-swarm/page-data.json",
    "revision": "e7435232d5a4e75530298fa1be6e0571"
  },
  {
    "url": "component---src-pages-childhood-diary-swarm-scroll-js-cb121fa5e5a7953ec985.js"
  },
  {
    "url": "page-data/childhood-diary-swarm-scroll/page-data.json",
    "revision": "21d9ce47e2a9aed18f1d5c2e6376538d"
  },
  {
    "url": "component---src-pages-index-js-8d3b1a2cb7150fe5a32b.js"
  },
  {
    "url": "page-data/index/page-data.json",
    "revision": "27ff230bfb1613461350175e71c8ad3f"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\/page-data\/.*\.json/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|avif|svg|gif|tiff|js|woff|woff2|json|css)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, new workbox.strategies.StaleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^/visualization-sketches`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/visualization-sketches/app-44fcb6b4d6aa282d48be.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/visualization-sketches/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
