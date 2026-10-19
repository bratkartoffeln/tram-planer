'use strict';
const CACHE_PREFIX = 'fahrplan-manager-tablet-';
const CACHE = CACHE_PREFIX + 'v6.2.0';
const ASSETS = [
  './', './index.html', './app.js', './announcements.js',
  './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './audio/announcements-data.js', './audio/announcements.json', './audio/ding-dong.wav'
];

self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  const response = await fetch('./audio/announcements.json', {cache: 'no-store'});
  if (!response.ok) throw new Error('The announcement list could not be loaded.');
  const announcements = await response.json();
  const audioPaths = Object.values(announcements).map(path => './' + path);
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
