// Built into dist/sw.js by vite.config.ts, which fills in the file list and a version.
const FILES = __FILES__, C = 'pamoja-' + __VER__
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => Promise.allSettled(FILES.map(f => c.add(f))))); self.skipWaiting() })
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('pamoja-') && x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())) })
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url)
  if (r.method !== 'GET' || u.origin !== location.origin || r.headers.has('range') || u.pathname.includes('/videos/')) return
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => {
    const net = fetch(r).then(res => { if (res.ok && res.type === 'basic') { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)) } return res })
      .catch(() => hit || (r.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
    return hit || net
  }))
})
