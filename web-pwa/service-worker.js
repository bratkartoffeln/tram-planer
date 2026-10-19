'use strict';
const CACHE_PREFIX = 'fahrplan-manager-tablet-';
const CACHE = CACHE_PREFIX + 'v6.2.2-recordings-complete';
const ASSETS = [
  './', './index.html', './app.js', './announcements.js', './erfurt-network.js', './line-editor.js',
  './cockpit.js', './cockpit.css', './images/tram-cockpit.jpg', './images/credits.json', './audio/effects/catalog.json',
  ...['door_open','door_close','emergency','traffic','passenger','finish','back'].map(id=>'./audio/effects/'+id+'.mp3'),
  './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './audio/announcements-data.js', './audio/announcements.json', './audio/catalog.json',
  './audio/chimes/ding_dong.mp3', './audio/chimes/dong_dong_ding.mp3'
];

self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  const response = await fetch('./audio/catalog.json', {cache: 'no-store'});
  if (!response.ok) throw new Error('The announcement list could not be loaded.');
  const announcements = await response.json();
  const audioPaths = announcements.map(item => './' + item.file);
  await cache.addAll([...ASSETS, ...audioPaths]);
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
