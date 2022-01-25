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
    "url": "webpack-runtime-f6dc4d4beef097d7c996.js"
  },
  {
    "url": "framework-7357b6dab58473f763f1.js"
  },
  {
    "url": "app-18b05178eb020b681443.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "343cc46c5c11b0382221e69f70a81017"
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
    "revision": "7a1b9e2c4eecb197333376b75295578d"
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
    "url": "styles.1763038925689997a8f0.css"
  },
  {
    "url": "da62aacd83b14b2f79dae7236aa2cb307a6a819e-f456dbeaaefdc6a82e62.js"
  },
  {
    "url": "component---src-pages-childhood-diary-binned-js-533afdeeb424ea79e723.js"
  },
  {
    "url": "page-data/childhood-diary-binned/page-data.json",
    "revision": "41ca7bea5eb2aeff05d4f08a1ba118ae"
  },
  {
    "url": "55e10c9a963b304a3e4fbf1778e5afaf572335a6-504487886cf8dda7c4e6.js"
  },
  {
    "url": "component---src-pages-childhood-diary-scatter-scroll-js-dd1929e34a17ad7507bc.js"
  },
  {
    "url": "page-data/childhood-diary-scatter-scroll/page-data.json",
    "revision": "952370d499de26cae079d95a2fc6bff5"
  },
  {
    "url": "component---src-pages-childhood-diary-svg-js-62524c97d3620cfc3da2.js"
  },
  {
    "url": "page-data/childhood-diary-svg/page-data.json",
    "revision": "00a514a1b79e080105a7b0f1f2a90fa0"
  },
  {
    "url": "component---src-pages-childhood-diary-swarm-js-3eb688097ccdb5084fec.js"
  },
  {
    "url": "page-data/childhood-diary-swarm/page-data.json",
    "revision": "e7435232d5a4e75530298fa1be6e0571"
  },
  {
    "url": "82a4a9a39e7e96addb18604a1f512479495c2b93-008d2c79451d43fc3fa5.js"
  },
  {
    "url": "component---src-pages-childhood-diary-swarm-scroll-drawing-js-5f6c9500156481098999.js"
  },
  {
    "url": "page-data/childhood-diary-swarm-scroll-drawing/page-data.json",
    "revision": "50e1455cc48fa0bf614fb358dae3788d"
  },
  {
    "url": "component---src-pages-childhood-diary-swarm-scroll-sterile-js-6bf0873164c5310d3e8c.js"
  },
  {
    "url": "page-data/childhood-diary-swarm-scroll-sterile/page-data.json",
    "revision": "a86b2320811e7e1f4e7f01034c2630c5"
  },
  {
    "url": "component---src-pages-index-js-8d3b1a2cb7150fe5a32b.js"
  },
  {
    "url": "page-data/index/page-data.json",
    "revision": "27ff230bfb1613461350175e71c8ad3f"
  },
  {
    "url": "component---src-pages-memorialgraph-js-338f7f1ae8549f700a0c.js"
  },
  {
    "url": "page-data/memorialgraph/page-data.json",
    "revision": "b2f4ecc08a8528f74b4c1c7acb575ae5"
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
  if (!resources || !(await caches.match(`/visualization-sketches/app-18b05178eb020b681443.js`))) {
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
