/* Service worker – offline cache for AEA Coach (stale-while-revalidate). Bump CACHE after changes. */
const CACHE = 'aea-coach-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './icon.svg',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './js/core.js',
  './js/svg.js',
  './js/diagrams.js',
  './js/calc.js',
  './js/games.js',
  './js/app.js',
  './data/p0_strategy.js',
  './data/p1_basics.js',
  './data/p2_lcia.js',
  './data/p3_uncertainty.js',
  './data/p4_io.js',
  './data/p5_allocation.js',
  './data/p6_consequential.js',
  './data/p7_decision.js',
  './data/p8_review.js',
  './data/p9_risk.js',
  './data/c1_company.js',
  './data/c2_ghg.js',
  './data/c3_weighting.js',
  './data/c4_management.js',
  './data/c5_ems.js',
  './data/c6_targets.js',
  './data/c7_lcc.js',
  './data/c8_economy.js',
  './data/c9_supply.js',
  './data/iso.js',
  './data/cases.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      const network = fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
