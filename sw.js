// ============================================================
// GoalCurrent.live — Service Worker
// Version: 1.0.0  |  FIFA World Cup 2026
// ============================================================

const CACHE_NAME = 'goalcurrent-v1';
const API_CACHE  = 'goalcurrent-api-v1';

// Static files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/worldcup2026/index.html',
  '/worldcup2026/fixtures.html',
  '/worldcup2026/standings.html',
  '/worldcup2026/groups.html',
  '/worldcup2026/teams.html',
  '/js/worldcup-data.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// ── INSTALL ─────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Use individual adds so one missing file doesn't break everything
        return Promise.allSettled(
          STATIC_ASSETS.map(url => cache.add(url).catch(err => {
            console.warn('[SW] Failed to cache:', url, err);
          }))
        );
      })
  );
  self.skipWaiting();
});

// ── ACTIVATE ─────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== API_CACHE)
          .map(name => {
            return caches.delete(name);
          })
      )
    )
  );
  self.clients.claim();
});

// ── FETCH ─────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ── 1. Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // ── 2. Skip cross-origin requests (CDNs, external APIs)
  if (url.origin !== location.origin) return;

  // ── 3. API calls → Network first, short cache fallback (60 seconds)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithTimeout(event.request, 5000));
    return;
  }

  // ── 4. HTML pages → Network first, fallback to cache
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstHTML(event.request));
    return;
  }

  // ── 5. Static assets → Cache first, fallback to network
  event.respondWith(cacheFirst(event.request));
});

// ── STRATEGIES ───────────────────────────────────────────────

// Cache first (for JS, CSS, images, icons)
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline — asset not cached', { status: 503 });
  }
}

// Network first for HTML pages
async function networkFirstHTML(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Return offline fallback page if available
    const fallback = await caches.match('/offline.html');
    return fallback || new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>GoalCurrent — Offline</title>
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>
        body{margin:0;background:#07111f;color:#fff;font-family:sans-serif;
          display:flex;flex-direction:column;align-items:center;
          justify-content:center;min-height:100vh;text-align:center;padding:20px}
        h1{color:#1d4ed8;font-size:2rem}
        p{color:#94a3b8;max-width:300px}
        a{color:#1d4ed8;text-decoration:none;margin-top:20px;display:inline-block}
      </style></head>
      <body>
        <h1>⚽ GoalCurrent</h1>
        <p>You're offline. Please check your connection to see live World Cup scores.</p>
        <a href="/">Try again</a>
      </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Network first with timeout for API calls
async function networkFirstWithTimeout(request, timeout) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timer);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request, { cacheName: API_CACHE });
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
