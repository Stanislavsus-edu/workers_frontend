const staticCacheName = 's-app-v2'
const dynamicCacheName = 'd-app-v2'

// const assetUrls = [
//   'index.html',
//   'css/style.css',
//   'js/News.js',
//   'js/app.js',
//   'disconnect.html',
// ]

self.addEventListener('install', evt => {
  evt.waitUntil(async () => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll([
      '/src/',
      '/src/index.html',
      '/src/css/style.css',
      '/src/js/News.js',
      '/src/js/app.js',
      '/src/disconnect.html',
    ])
    await self.skipWaiting()
  })
});

self.addEventListener('activate', evt => {
  evt.waitUntil(async () => {
    const cacheNames = await caches.keys()
    await Promise.all(
      cacheNames
        .filter(name => name !== staticCacheName)
        .filter(name => name !== dynamicCacheName)
        .map(name => caches.delete(name))
    )
    await self.clients.claim();
  })
});

self.addEventListener('fetch', evt => {
  const {request} = evt

  const url = new URL(request.url)
  if (url.origin === location.origin) {
    evt.respondWith(cacheFirst(request))
  } else {
    evt.respondWith(networkFirst(request))
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (e) {
    const cached = await cache.match(request)
    return cached ?? await caches.match('/src/disconnect.html')
  }
}
