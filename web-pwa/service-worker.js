'use strict';
const CACHE_PREFIX = 'fahrplan-manager-tablet-';
const CACHE = CACHE_PREFIX + 'v6.2.11-kt4dc-lamps';
const ASSETS = [
  './', './index.html', './app.js', './announcements.js', './erfurt-network.js', './line-editor.js', './network-editor.js', './network-plan.json', './network-plan-data.js',
  './cab-layout.js', './cab-layout.css', './cockpit.js', './cockpit.css', './shell.css', './images/tram-cockpit.jpg', './images/credits.json', './images/cab-panel-photoreal.webp', './audio/effects/catalog.json',
  './vehicles.js', './vehicle-previews.js', './vehicles.css', './vehicle-types.json', './vehicle-types-data.js', './images/vehicles/credits.json',
  './vehicle-bundles.js', './vehicle-bundles-data.js', './vehicle-bundle-assets.json', './updates.js',
  ...['door_open','door_close','door_closed','emergency','traffic','passenger','finish','back'].map(id=>'./audio/effects/'+id+'.mp3'),
  './favicon-32.png', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './audio/announcements-data.js', './audio/announcements.json', './audio/catalog.json',
  './audio/chimes/ding_dong.mp3', './audio/chimes/dong_dong_ding.mp3'
];

self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  const response = await fetch('./audio/catalog.json', {cache: 'no-store'});
  if (!response.ok) throw new Error('The announcement list could not be loaded.');
  const announcements = await response.json();
  const audioPaths = announcements.map(item => './' + item.file);
  const photoResponse = await fetch('./images/vehicles/credits.json', {cache: 'no-store'});
  if (!photoResponse.ok) throw new Error('The vehicle photo list could not be loaded.');
  const photos = await photoResponse.json();
  const photoPaths = Object.values(photos).map(photo => './' + photo.file);
  const bundleResponse = await fetch('./vehicle-bundle-assets.json', {cache: 'no-store'});
  if (!bundleResponse.ok) throw new Error('The vehicle bundle list could not be loaded.');
  const bundlePaths = (await bundleResponse.json()).map(path => './' + path);
  await cache.addAll([...new Set([...ASSETS, ...audioPaths, ...photoPaths, ...bundlePaths])]);
  await self.skipWaiting();
})()));

self.addEventListener('activate', event => event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)));
  await self.clients.claim();
})()));

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(event.request);
    if (hit) return hit;
    try {
      const response = await fetch(event.request);
      if (response.ok && response.type === 'basic') await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      if (event.request.mode === 'navigate') return await cache.match('./index.html');
      return Response.error();
    }
  })());
});
