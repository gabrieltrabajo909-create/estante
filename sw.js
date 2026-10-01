// La app intenta traer la última versión; las librerías y los idiomas de lectura (pesados) se guardan para no bajarlos de nuevo.
const CACHE = 'estante-v1';
const HEAVY = /cdn\.jsdelivr\.net|tessdata|traineddata/;
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'index.html', 'manifest.webmanifest', 'icon-192.png']))); self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = e.request.url;
  if (e.request.method !== 'GET' || /openlibrary\.org\/(api|search)|googleapis\.com/.test(u)) return;   // búsquedas de libros: siempre en vivo
  const put = r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); } return r; };
  if (HEAVY.test(u)) e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(put)));
  else e.respondWith(fetch(e.request).then(put).catch(() => caches.match(e.request)));
});
